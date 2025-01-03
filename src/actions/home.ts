"use server";

import { auth } from "@/auth";
import { cookies } from "next/headers";

export async function getHomeWallpaper() {
  const res = await fetch(`${process.env.SERVER_URL}/home`, {
    cache: "no-store",
    next: {
      tags: ["home"],
    },
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    throw new Error(errorMessage.message);
  }
  const wallpaper = await res.json();
  return wallpaper;
}

export async function updateHomeWallpaper(
  id: string,
  pc: string,
  mobile: string
) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/home`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({ id, pc, mobile }),
    cache: "no-store",
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    throw new Error(errorMessage.message);
  }
}
