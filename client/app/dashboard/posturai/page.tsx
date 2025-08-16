"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function AboutPosturai() {
  return (
    <div className="mt-4">
      <Link href={"/dashboard"}>
        <Button className="max-w-min">
          <ArrowLeft /> Home
        </Button>
      </Link>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-2">
        How Posturai works
      </h1>
      <div className="mx-auto max-w-4xl leading-7 [&:not(:first-child)]:mt-6 flex flex-col gap-8">
        <ol className="list-decimal [&>li]:mt-2">
          <li>
            Click the cool looking{" "}
            <span className="text-[var(--primary)]">green button</span> that
            says "New session" at the top of the sidebar (if the sidebar is
            hidden then click the little icon in the top left to open it)
          </li>
          <li>Let all the goodies load :)</li>
          <li>
            Just do whatever you're doing (vibe coding, emails, touching
            grass???). We'll make sure your back does turn into a Fibonacci
            circle{" "}
            <button
              className="p-0 m-0 gap-0 h-4 hover:cursor-pointer"
              onClick={() => {
                toast(
                  <div className="flex gap-6 items-center">
                    <Image
                      src={"/programmer.jpg"}
                      width={50}
                      height={50}
                      alt={"dog looking at you"}
                      className="inline rounded-[var(--radius)]"
                    />
                    <p className="leading-7 font-bold">Programmer moment</p>
                  </div>
                );
              }}
            >
              <Image
                src={"/programmer.jpg"}
                width={20}
                height={20}
                alt={"dog looking at you"}
                className="inline rounded-full"
              />
            </button>{" "}
            in the meantime!
          </li>{" "}
          <li>
            When you're done just click the{" "}
            <span className="text-[var(--destructive)]">
              stop session button
            </span>{" "}
            and it'll bring you to a session statistics page
          </li>
          <li>
            After you've taken in all of these cool numbers just click continue
            and repeat!
          </li>
        </ol>
        <div>
          <p className="mb-2">Other notes:</p>
          <ul className="ml-4 list-disc [&>li]:mt-2">
            <li className="font-bold">
              When the model doesn't detect any person then it'll assume you're
              taking a break (and breaks are good)
            </li>
            <li>
              When you pause a session you'll be asked whether you're taking a
              break or not, just in case you're joining a meeting or something
              and don't want it running in the background
            </li>
            <li>
              Check out the settings page for options on changing the volume,
              disabling certain things and more!
            </li>
            <li>To get the best results try the following things:</li>
            <ul className="ml-6 list-disc [&>li]:mt-2">
              <li>Try not having people in the background</li>
              <li>
                Have the camera facing you from the front, try not to have it
                looking up at you from the bottom or at other weird angles
              </li>
            </ul>
          </ul>
        </div>
        <p>
          That's it! We hope you enjoy Posturai, and if you're have trouble with
          something then feel free to reach out to us! Just click your slick
          looking profile pic in the bottom left and click contact!
        </p>
      </div>
    </div>
  );
}
