"use client";

import { useRef, useEffect, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import * as ort from "onnxruntime-web";
import { argMax, softmax } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { toast } from "sonner";
import { db, SessionInterface } from "@/lib/db";

interface PoseResult {
  landmarks?: NormalizedLandmark[][];
}

interface Duration {
  start: number | null;
  end: number | null;
}

export default function Session() {
  const videoRef = useRef<HTMLVideoElement | null>(null); // hidden video element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const onnxSessionRef = useRef<ort.InferenceSession | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null); // <-- added
  const color = useRef<string>("green");
  const pausedRef = useRef<boolean>(false);
  // Capture an exact timestamp when the user clicks Stop to avoid UI/effect latency skewing durations
  const stopAtRef = useRef<number | null>(null);

  const breakDurations = useRef<Duration[]>([]);
  const sittingDurations = useRef<Duration[]>([]);
  const toastedTime = useRef<number | null>(null);

  const router = useRouter();
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [paused, setPaused] = useState<boolean>(false);

  const BREAK_REMINDER_TIME = 2000; // In milleseconds
  const TIME_BETWEEN_TOASTS = 3000; // In milleseconds

  // Dynamically size the canvas to its container and the video aspect ratio
  const syncCanvasSize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const video = videoRef.current;
    if (!canvas || !container) return;

    const containerWidth = container.clientWidth;
    // Default to 4:3 until we know the video dimensions
    let aspect = 4 / 3;
    if (video && video.videoWidth && video.videoHeight) {
      aspect = video.videoWidth / video.videoHeight;
    }

    const cssWidth = Math.max(1, containerWidth); // prevent 0
    const cssHeight = Math.max(1, Math.round(cssWidth / aspect));

    // CSS size (how big it appears)
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    // Internal drawing buffer (match CSS px for simplicity and to avoid double-scaling in DrawingUtils)
    canvas.width = cssWidth;
    canvas.height = cssHeight;
  };

  async function runModel(results: PoseResult) {
    if (!results?.landmarks?.length) return;

    const flatArray: number[] = [];
    for (const landmarks of results.landmarks) {
      for (let i = 0; i < landmarks.length; ++i) {
        const lm = landmarks[i];
        flatArray.push(lm.x, lm.y, lm.z, lm.visibility ?? 0);
      }
    }
    if (!onnxSessionRef.current) return;
    const onnxTensor = new Float32Array(flatArray);
    const outputs = await onnxSessionRef.current.run({
      input: new ort.Tensor("float32", onnxTensor, [1, 132]),
    });

    const out = (outputs as Record<string, ort.Tensor>).output;
    if (out) {
      // @ts-ignore
      const cls = Math.round(argMax(softmax(out.cpuData as Float32Array)));
      color.current = cls === 1 ? "green" : "red";
    }
  }

  function detectPose() {
    if (!videoRef.current || !poseLandmarkerRef.current || !canvasRef.current)
      return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const drawingUtils = new DrawingUtils(ctx);

    const renderLoop = () => {
      // If paused, stop the loop to save resources
      if (pausedRef.current) {
        return;
      }

      if (!videoRef.current || !poseLandmarkerRef.current || !canvasRef.current)
        return;

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      const results = poseLandmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
      ) as PoseResult;

      if (results.landmarks?.length) {
        if (
          sittingDurations.current.length === 0 ||
          sittingDurations.current[sittingDurations.current.length - 1].end !==
            null
        ) {
          console.info(
            "Starting a new sitting duration! Current time: " +
              performance.now()
          );
          sittingDurations.current.push({
            start: performance.now(),
            end: null,
          });
        }

        if (
          sittingDurations.current.length !== 0 &&
          performance.now() - // @ts-ignore
            sittingDurations.current[sittingDurations.current.length - 1]
              .start >
            BREAK_REMINDER_TIME &&
          (toastedTime.current === null ||
            performance.now() - toastedTime.current > TIME_BETWEEN_TOASTS)
        ) {
          toastedTime.current = performance.now();
          toast.warning(
            "Woah, woah, woah. You've been sitting down for quite some time. Go out and touch grass!",
            {
              position: "top-center",
              duration: 3000,
            }
          );
        }

        void runModel(results);
        for (const landmarks of results.landmarks) {
          drawingUtils.drawLandmarks(landmarks, {
            radius: 3,
            color: color.current,
          });
          drawingUtils.drawConnectors(
            landmarks,
            PoseLandmarker.POSE_CONNECTIONS,
            { color: "white" }
          );
        }
      } else {
        // If there was a start time for the sitting duration then add in the end time since the user is not sitting anymore
        if (
          sittingDurations.current.length !== 0 &&
          sittingDurations.current[sittingDurations.current.length - 1].end ===
            null
        )
          sittingDurations.current[sittingDurations.current.length - 1].end =
            performance.now();

        // The user is taking a break
        breakDurations.current.push({ start: performance.now(), end: null });
        pauseAll();
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();
  }

  useEffect(() => {
    let isMounted = true;

    async function init() {
      // Guard: if already initialized, skip
      if (poseLandmarkerRef.current || mediaStreamRef.current) return;

      onnxSessionRef.current = await ort.InferenceSession.create(
        "/model.onnx",
        {
          executionProviders: ["wasm"],
        }
      );

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      if (!isMounted) {
        landmarker.close();
        return;
      }

      poseLandmarkerRef.current = landmarker;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Size canvas once we know the video dimensions
          videoRef.current.onloadedmetadata = () => {
            syncCanvasSize();
          };
          try {
            await videoRef.current.play();
          } catch {
            /* autoplay may be blocked */
          }
          // Also size right away using fallback aspect
          syncCanvasSize();
          detectPose();
        }
      } catch (err) {
        console.error("Camera access denied or failed", err);
      }
    }

    async function stopAll() {
      const now = stopAtRef.current ?? performance.now();
      if (
        sittingDurations.current[sittingDurations.current.length - 1].end ===
        null
      ) {
        console.info(
          "Stopping the current sitting duration, current time: " + now
        );
        sittingDurations.current[sittingDurations.current.length - 1].end = now;
      }

      if (
        breakDurations.current.length > 0 &&
        breakDurations.current[breakDurations.current.length - 1].end === null
      )
        breakDurations.current[breakDurations.current.length - 1].end = now;

      // Save everything to Dexie
      let session: SessionInterface = {
        date: new Date(),
        duration: 0,
        timeSpentSitting: 0,
        sittingDurations: [],
        numberOfBreaks: 0,
        breakDurations: [],
      };

      for (let sittingDuration of sittingDurations.current)
        session.timeSpentSitting += // @ts-ignore
          (sittingDuration.end - sittingDuration.start) / 1000;

      session.sittingDurations = sittingDurations.current.map(
        (sittingDuration) => {
          // @ts-ignore
          const duration = (sittingDuration.end - sittingDuration.start) / 1000;
          session.duration += duration;
          return duration;
        }
      );
      session.breakDurations = breakDurations.current.map((breakDuration) => {
        // @ts-ignore
        const duration = (breakDuration.end - breakDuration.start) / 1000;
        session.duration += duration;
        return duration;
      });
      session.numberOfBreaks = breakDurations.current.length;

      console.log(session);

      await db.sessions.add(session);
      toast.success("Successfully saved the session data!");

      // Stop animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      } // Stop media tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      } // Clear video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      } // Release pose landmarker
      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close();
        poseLandmarkerRef.current = null;
      }
    }

    if (showVideo) {
      const initPromise = init();
      toast.promise(initPromise, {
        loading: "Loading all the goodies",
        success: () => {
          return "Goodies loaded :)";
        },
        error: "Oh no, the goodies got lost",
      });
    } else {
      stopAll();
      router.replace("/dashboard/session/statistics");
    }

    return () => {
      isMounted = false; // If component unmounts or dependency changes, ensure cleanup
      if (!showVideo) {
        stopAll();
      }
    };
  }, [showVideo]);

  // Recalculate canvas size on window resize/orientation changes
  useEffect(() => {
    const handler = () => syncCanvasSize();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  function pauseAll() {
    pausedRef.current = true;
    setPaused(true);
    try {
      videoRef.current?.pause();
    } catch {
      /* ignore */
    }
    // Stop the RAF loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    // Close landmarker to free its resources
    if (poseLandmarkerRef.current) {
      try {
        poseLandmarkerRef.current.close();
      } catch {
        /* ignore */
      }
      poseLandmarkerRef.current = null;
    }
    // Stop camera tracks to fully pause the mediastream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  // Stop session immediately: capture timestamp and cancel RAF to minimize timing drift
  function handleStop() {
    stopAtRef.current = performance.now();
    // Prevent another RAF tick between click and effect
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    pausedRef.current = true;
    setShowVideo(false);
  }

  function resumeAll() {
    pausedRef.current = false;
    setPaused(false);

    // If we had added a break then it would look like {start time, end time: ____ <-- add end time here} so add in the end time
    if (
      breakDurations.current.length !== 0 &&
      breakDurations.current[breakDurations.current.length - 1].end === null
    )
      breakDurations.current[breakDurations.current.length - 1].end =
        performance.now();

    // Add in a start time for sitting down
    if (
      sittingDurations.current.length === 0 ||
      sittingDurations.current[sittingDurations.current.length - 1].end !== null
    )
      sittingDurations.current.push({ start: performance.now(), end: null });

    const start = async () => {
      // Ensure landmarker exists
      if (!poseLandmarkerRef.current) {
        try {
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
          );
          poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath:
                  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
                delegate: "GPU",
              },
              runningMode: "VIDEO",
              numPoses: 1,
            }
          );
        } catch (err) {
          console.error("Failed to recreate landmarker:", err);
          return;
        }
      }
      // Ensure media stream is available
      if (!mediaStreamRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              syncCanvasSize();
            };
            try {
              await videoRef.current.play();
            } catch {
              /* autoplay may be blocked */
            }
            syncCanvasSize();
          }
        } catch (err) {
          console.error("Failed to resume camera:", err);
          return;
        }
      } else if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch {
          /* ignore */
        }
        syncCanvasSize();
      }

      detectPose();
    };

    void start();
  }

  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-[640px] grid grid-cols-2 gap-2">
          <Button variant="destructive" onClick={handleStop}>
            Stop Session
          </Button>
          {paused ? (
            <Button variant={"secondary"} onClick={() => resumeAll()}>
              Unpause
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"secondary"}>Pause</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you taking a break?</AlertDialogTitle>
                  <AlertDialogDescription>
                    If you are (as you should be{" "}
                    <button
                      className="p-0 m-0 gap-0 h-4 hover:cursor-pointer"
                      onClick={() => {
                        toast(
                          <div className="flex gap-6 items-center">
                            <Image
                              src={"/dog-eyes.png"}
                              width={50}
                              height={50}
                              alt={"dog looking at you"}
                              className="inline rounded-full"
                            />
                            <p className="leading-7 font-bold">
                              You better be taking breaks
                            </p>
                          </div>
                        );
                      }}
                    >
                      <Image
                        src={"/dog-eyes.png"}
                        width={20}
                        height={20}
                        alt={"dog looking at you"}
                        className="inline rounded-full"
                      />
                    </button>
                    ) then we'll log in the duration of the break for you.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex">
                  <AlertDialogCancel
                    className="flex-1"
                    onClick={() => {
                      pauseAll();
                    }}
                  >
                    No
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="flex-1"
                    onClick={() => {
                      // The user is taking a break so add that as a new duration
                      breakDurations.current.push({
                        start: performance.now(),
                        end: null,
                      });
                      pauseAll();
                    }}
                  >
                    Yes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <div ref={containerRef} className="">
          <video ref={videoRef} style={{ display: "none" }} playsInline muted />
          <canvas
            ref={canvasRef}
            width={(() => {
              if (window.innerWidth < 700) return 380;
              return 640;
            })()}
            height={(() => {
              console.log(window.innerWidth);
              if (window.innerWidth < 700) return 220;
              return 480;
            })()}
          />
        </div>
      </div>
    </div>
  );
}
