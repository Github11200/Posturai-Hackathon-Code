import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="mt-4">
      <Link href={"/dashboard"}>
        <Button className="max-w-min">
          <ArrowLeft /> Home
        </Button>
      </Link>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-6">
        Why Posture is important.
      </h1>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Benefits
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-4">
            Good posture is more than just standing tall. Good posture is a
            foundation for overall health, confidence, and physical performance.
            On the contrary, poor posture leads to long-term health issues that
            extend from head to toe.
          </p>
        </div>
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Physical Health Benefits
          </h3>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              <b>Reduces Pain:</b> Proper posture helps prevent and alleviate
              back, neck, and shoulder pain by reducing unnecessary strain on
              muscles and joints.
            </li>
            <li>
              <b>Supports Joint Health:</b> Balanced alignment minimizes wear
              and tear on joints, reducing the risk of arthritis and joint
              degeneration.
            </li>
            <li>
              <b>Improves Breathing:</b> An upright posture opens the chest
              cavity, allowing the lungs to expand fully and improving oxygen
              intake.
            </li>
            <li>
              <b>Enhances Digestion:</b> Good posture gives your insides the
              space they deserve—like rolling out a VIP red carpet for your body
              to go through.{" "}
            </li>
          </ul>
        </div>
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Mental and Emotional Benefits
          </h3>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              <b>Boosts Confidence:</b> Good posture give you the confidence to
              fake it till you make it.
            </li>
            <li>
              <b>Reduces Stress:</b> Studies show that upright posture can lower
              stress levels and boost mood by improving blood flow and hormone
              balance.
            </li>
          </ul>
        </div>
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Performance and Productivity
          </h3>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              <b>Better Movement Efficiency:</b> Proper posture aligns muscles
              for optimal strength and coordination so you can go out and win
              those races.
            </li>
            <li>
              <b>Prevents Fatigue:</b> Maintaining good posture helps preserve
              your body so future-you will thank present-you for keeping
              everything in line.
            </li>
          </ul>
        </div>
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Long-Term Wellness
          </h3>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              <b>Prevents Spinal Issues:</b> Good posture supports the natural
              curves of the spine, reducing the risk of chronic pain and spinal
              deformities.
            </li>
            <li>
              <b>Supports Healthy Aging:</b> Maintaining good posture throughout
              life helps preserve mobility, balance, and independence in older
              age.
            </li>
          </ul>
        </div>
        <div>
          <p className="leading-7 [&:not(:first-child)]:mt-4">
            So yeah, posture is pretty dang important.
          </p>
        </div>
      </div>
    </div>
  );
}
