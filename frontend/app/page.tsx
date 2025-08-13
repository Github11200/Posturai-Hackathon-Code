"use client";

import { useRef, useEffect } from "react";
import {
  PoseLandmarker, FilesetResolver, DrawingUtils
} from "@mediapipe/tasks-vision"; 
import * as ort from "onnxruntime-web";
import { argMax, softmax } from "@/utils/utils";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null); // hidden video element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const onnxSessionRef = useRef<ort.InferenceSession | null>(null);
  const color = useRef<string>("green")

  useEffect(() => {
    let isMounted = true;

    async function init() {
      onnxSessionRef.current = await ort.InferenceSession.create(
        "/model.onnx",
        {
          executionProviders: ["wasm"], // or "webgl" for GPU acceleration
        }
      );

      // Load Mediapipe model
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

      // This exists since react re renders twice
      if (!isMounted) return;

      poseLandmarkerRef.current = landmarker;

      // Start camera (video feed hidden)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try { await videoRef.current.play(); } catch { /* autoplay may be blocked */ }
          detectPose();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Camera access denied or failed", err);
      }
    }

    interface LandmarkPoint { x: number; y: number; z: number; visibility?: number }
    interface PoseResult { landmarks?: LandmarkPoint[][] }

    async function runModel(results: PoseResult) {
      if (!results?.landmarks?.length) return;

      const flatArray: number[] = [];
      for (const landmarks of results.landmarks) {
        for (let i = 0; i < landmarks.length; ++i) {
          const lm = landmarks[i];
            flatArray.push(lm.x, lm.y, lm.z, lm.visibility);
        }
      }
      if (!onnxSessionRef.current) return; // session not ready yet
      const onnxTensor = new Float32Array(flatArray);
      const outputs = await onnxSessionRef.current.run({
        input: new ort.Tensor("float32", onnxTensor, [1, 132]),
      });

      if (Math.round(argMax(softmax(outputs.output.cpuData))) === 1) color.current = "green"
      else color.current = "red"
    }

    async function detectPose() {
      if (!videoRef.current || !poseLandmarkerRef.current || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      const drawingUtils = new DrawingUtils(ctx);
      
      const renderLoop = () => {
        // Black background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

        // @ts-ignore
        const results = poseLandmarkerRef.current.detectForVideo( // @ts-ignore
          videoRef.current, 
          performance.now()
        ) as PoseResult;

        if (results.landmarks?.length) {
          void runModel(results);
          for (const landmarks of results.landmarks) {
            // @ts-ignore
            drawingUtils.drawLandmarks(landmarks, { radius: 3, color: color.current });
            // @ts-ignore
            drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: "white" });
          }
        }

        animationFrameRef.current = requestAnimationFrame(renderLoop);
      };

      renderLoop();
    }

    init();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", background: "black" }}>
      {/* Hidden video source */}
      <video ref={videoRef} style={{ display: "none" }} playsInline muted />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: "block", margin: "0 auto" }}
      />
    </div>
  );
}
