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
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { PortalLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default async function Dashboard() {
  const { isAuthenticated, getAccessTokenRaw } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/api/auth/login");

  const accessToken = await getAccessTokenRaw();
  const baseUrl = process.env.KINDE_ISSUER_URL;
  const res = await fetch(`${baseUrl}/account_api/v1/entitlements`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  const payload = await res.json();
  const plans = payload?.data?.plans ?? [];

  if (plans.length == 0)
    // If they aren't paying then redirect them
    redirect("/api/auth/logout");

  return (
    <div>
      <h1>Dashboard :)</h1>
      <LogoutLink>Logout</LogoutLink>
      <PortalLink>Account</PortalLink>
    </div>
  );
}
