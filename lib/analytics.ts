"use client";

import { track as vercelTrack } from "@vercel/analytics";

type EventName = "whatsapp_click" | "call_click" | "email_click" | "quote_submit" | "quote_cta_click" | "map_toggle";

export function track(event: EventName, props?: Record<string, string | number | boolean>) {
  try {
    vercelTrack(event, props);
  } catch {
    /* analytics must never break the UI */
  }
}
