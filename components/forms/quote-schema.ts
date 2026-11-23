import { z } from "zod";

export const serviceOptions = [
  "Laser scanning / point cloud",
  "LiDAR / photogrammetry",
  "CAD drafting",
  "3D CAD modelling",
  "Scan-to-BIM",
  "Steel detailing",
  "GIS mapping",
  "Gas pipeline / CGD GIS",
  "Telecom design",
  "BIM-to-GIS",
  "Technology (web, app, IT)",
  "Other",
] as const;

export const fileTypeOptions = [
  "E57 / RCP / LAS (point cloud)",
  "DWG / DXF",
  "RVT / IFC",
  "PDF / scanned drawings",
  "SHP / GDB / GPKG",
  "Not sure yet",
] as const;

export const budgetOptions = {
  INR: ["Under ₹50,000", "₹50,000 – ₹2 lakh", "₹2 – ₹10 lakh", "Above ₹10 lakh"],
  USD: ["Under US$2,000", "US$2,000 – 10,000", "Above US$10,000"],
} as const;

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

/** Step 1: the lead. Four things to type, everything else comes later. */
export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.email("Enter a valid work email").max(160),
  services: z.array(z.enum(serviceOptions)).min(1, "Choose at least one service"),
  message: optionalText(2000),
  consent: z.literal(true, { error: "Please accept so we can reply to you" }),
  // Anti-spam
  website: z.string().max(0).optional().or(z.literal("")), // honeypot: must stay empty
  startedAt: z.number().int().positive(),
});

/** Step 2 (optional, after the lead is sent): details that speed up scoping. */
export const quoteDetailsSchema = z.object({
  ref: z.string().regex(/^IE-[A-Z0-9]{4,8}$/),
  company: optionalText(120),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,18}$/, "Enter a phone number with country code")
    .optional()
    .or(z.literal("")),
  fileType: z.enum(fileTypeOptions).optional().or(z.literal("")),
  projectSize: optionalText(120),
  deadline: optionalText(40),
  budget: optionalText(60),
  fileLink: z.url("Enter a full link (https://…)").max(500).optional().or(z.literal("")),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
export type QuoteDetails = z.infer<typeof quoteDetailsSchema>;

export type QuoteResult =
  | { ok: true; ref: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };
