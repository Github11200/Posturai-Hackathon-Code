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

export default function Session() {
  const videoRef = useRef<HTMLVideoElement | null>(null); // hidden video element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const onnxSessionRef = useRef<ort.InferenceSession | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null); // <-- added
  const color = useRef<string>("green");
  const pausedRef = useRef<boolean>(false);

  const router = useRouter();
  const [showVideo, setShowVideo] = useState<boolean>(true);

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
          try {
            await videoRef.current.play();
          } catch {
            /* autoplay may be blocked */
          }
          detectPose();
        }
      } catch (err) {
        console.error("Camera access denied or failed", err);
      }
    }

    interface PoseResult {
      landmarks?: NormalizedLandmark[][];
    }

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
        if (pausedRef.current)
          // If it's paused then don't do any video processing
          animationFrameRef.current = requestAnimationFrame(renderLoop);

        if (
          !videoRef.current ||
          !poseLandmarkerRef.current ||
          !canvasRef.current
        )
          return;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        const results = poseLandmarkerRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        ) as PoseResult;

        if (results.landmarks?.length) {
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
        }

        animationFrameRef.current = requestAnimationFrame(renderLoop);
      };

      renderLoop();
    }

    function stopAll() {
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
      init();
    } else {
      stopAll();
      router.replace("/dashboard");
    }

    return () => {
      isMounted = false; // If component unmounts or dependency changes, ensure cleanup
      if (!showVideo) {
        stopAll();
      }
    };
  }, [showVideo]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full grid grid-cols-2 gap-2">
          <Button variant="destructive" onClick={() => setShowVideo(false)}>
            Stop Session
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              pausedRef.current = !pausedRef.current;
            }}
          >
            Pause Session
          </Button>
        </div>
        <div>
          <video ref={videoRef} style={{ display: "none" }} playsInline muted />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{ display: "block", margin: "0 auto" }}
          />
        </div>
      </div>
    </div>
  );
}
