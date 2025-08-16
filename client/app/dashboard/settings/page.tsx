"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { db, SettingsInterface } from "@/lib/db";
import { ArrowLeft, CircleQuestionMark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

export default function Settings() {
  const [currentSettings, setCurrentSettings] =
    useState<null | SettingsInterface>(null);
  const router = useRouter();

  useEffect(() => {
    db.settings.get(0).then((data) => {
      if (data !== undefined) setCurrentSettings(data);
    });
  }, []);

  const updateDb = () => {
    console.log(currentSettings);

    if (currentSettings !== null)
      db.settings
        .update(0, currentSettings)
        .then(() =>
          toast.success("Saved the settings!", { position: "bottom-right" })
        );
  };

  return (
    <div className="pt-2">
      <Button
        className="max-w-min"
        onClick={async () => {
          await updateDb();
          router.push("/dashboard");
        }}
      >
        <ArrowLeft /> Home
      </Button>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-6">
        Settings
      </h1>
      {currentSettings === null ? (
        <p>Loading...</p>
      ) : (
        <div className="max-w-xl mx-auto flex gap-6 flex-col">
          <Button onClick={updateDb}>Save</Button>
          <div className="flex flex-col gap-4">
            <Label htmlFor="noUserDetected">
              Log no user detected as a break{" "}
              <Tooltip>
                <TooltipTrigger>
                  <CircleQuestionMark size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    If you are in a session and there is no longer a person
                    there then should it be detected as a break
                  </p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Switch
              id="noUserDetected"
              checked={currentSettings.noUserDetectedIsBreak}
              onCheckedChange={(checked) => {
                setCurrentSettings({
                  ...currentSettings,
                  noUserDetectedIsBreak: checked,
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="breakTime">
              Break time reminder (minutes){" "}
              <Tooltip>
                <TooltipTrigger>
                  <CircleQuestionMark size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    After how many minutes should a reminder pop up for taking a
                    break
                  </p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id="breakTime"
              type="number"
              defaultValue={currentSettings.breakTimeReminder / 1000 / 60}
              onChange={(e) => {
                e.preventDefault();
                setCurrentSettings({
                  ...currentSettings,
                  breakTimeReminder: Number(e.target.value) * 60 * 1000,
                });
              }}
            />
          </div>{" "}
          <div className="flex flex-col gap-4">
            <Label htmlFor="soundEnabled">
              Sound enabled{" "}
              <Tooltip>
                <TooltipTrigger>
                  <CircleQuestionMark size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    This is the default setting for when you create a new sesion
                    for whether or not the sound will be enabled
                  </p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Switch
              id="soundEnabled"
              checked={currentSettings.soundEnabled}
              onCheckedChange={(checked) => {
                setCurrentSettings({
                  ...currentSettings,
                  soundEnabled: checked,
                });
              }}
            />
          </div>{" "}
          <div className="flex flex-col gap-4">
            <Label htmlFor="breakTime">
              Volume ({currentSettings.volume * 100}%){" "}
              <Tooltip>
                <TooltipTrigger>
                  <CircleQuestionMark size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>How loud the sound should be in the background</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Slider
              id="breakTime"
              defaultValue={[currentSettings.volume * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={(e) => {
                setCurrentSettings({
                  ...currentSettings,
                  volume: e[0] / 100,
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
