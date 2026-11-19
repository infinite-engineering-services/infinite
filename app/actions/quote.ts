"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import {
  quoteDetailsSchema,
  quoteSchema,
  type QuoteResult,
} from "@/components/forms/quote-schema";
import { promises, site } from "@/config/site";

// Best-effort, per-instance rate limit (8 per IP per hour, covering both steps).
// Use Upstash/Redis when running more than one instance.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

async function clientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

function render(rows: [string, string][]) {
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#475260;vertical-align:top">${esc(k)}</td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")}</table>`;
  return { text, html };
}

type Delivery = { ok: true } | { ok: false; message: string };

/** Sends one email to the team through Resend or Web3Forms. */
async function deliver(
  subject: string,
  rows: [string, string][],
  replyTo?: string,
  autoReply?: { to: string; text: string },
): Promise<Delivery> {
  const { text, html } = render(rows);
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from =
        process.env.QUOTE_FROM_EMAIL || `${site.name} <onboarding@resend.dev>`;
      const to = process.env.QUOTE_TO_EMAIL || site.email;
      const { error } = await resend.emails.send({ from, to, replyTo, subject, text, html });
      if (error) throw new Error(error.message);
      if (autoReply) {
        await resend.emails
          .send({ from, to: autoReply.to, subject: `We received your request`, text: autoReply.text })
          .catch(() => undefined);
      }
    } else if (process.env.WEB3FORMS_KEY) {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_KEY,
          subject,
          from_name: site.name,
          replyto: replyTo,
          message: text,
        }),
      });
      if (!res.ok) throw new Error(`Web3Forms ${res.status}`);
    } else if (process.env.NODE_ENV === "production") {
      console.error("[quote] No email provider configured (RESEND_API_KEY or WEB3FORMS_KEY)");
      return {
        ok: false,
        message: "Our form is temporarily unavailable. Please WhatsApp, call or email us directly.",
      };
    } else {
      console.info(`[quote] DEV: email provider not configured.\n${subject}\n${text}`);
    }
  } catch (err) {
    console.error("[quote] send failed", err);
    return { ok: false, message: "We couldn't send your request. Please WhatsApp or email us directly." };
  }
  return { ok: true };
}

function fieldErrorsOf(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) out[String(issue.path[0] ?? "form")] ??= issue.message;
  return out;
}

/** Step 1: the lead. */
export async function submitQuote(raw: unknown): Promise<QuoteResult> {
  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrorsOf(parsed.error.issues),
    };
  }
  const d = parsed.data;

  // Spam traps: honeypot filled, or submitted faster than a human can type
  if (d.website || Date.now() - d.startedAt < 3000) {
    return { ok: true, ref: "IE-RCVD" }; // silently accept, but drop
  }
  if (rateLimited(await clientIp())) {
    return { ok: false, message: "Too many requests. Please WhatsApp or call us instead." };
  }

  const ref = `IE-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const sent = await deliver(
    `Pilot / quote request ${ref}: ${d.services.join(", ")} (${d.name})`,
    [
      ["Reference", ref],
      ["Name", d.name],
      ["Email", d.email],
      ["Services", d.services.join(", ")],
      ["Message", d.message || ""],
    ],
    d.email,
    {
      to: d.email,
      text: `Hi ${d.name},\n\nThanks for contacting ${site.name}. Your reference is ${ref}. ${promises.reply} ${promises.nda}\nFor anything urgent, WhatsApp us: https://wa.me/${site.whatsapp}\n\n${site.legalName}`,
    },
  );
  return sent.ok ? { ok: true, ref } : sent;
}

/** Step 2 (optional): extra scoping details, linked to the step-1 reference. */
export async function addQuoteDetails(raw: unknown): Promise<QuoteResult> {
  const parsed = quoteDetailsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrorsOf(parsed.error.issues),
    };
  }
  const d = parsed.data;
  if (d.ref === "IE-RCVD") return { ok: true, ref: d.ref };
  if (rateLimited(await clientIp())) {
    return { ok: false, message: "Too many requests. Please WhatsApp or call us instead." };
  }
  const sent = await deliver(`Details for ${d.ref}`, [
    ["Reference", d.ref],
    ["Company", d.company || "–"],
    ["Phone", d.phone || "–"],
    ["Input files", d.fileType || "–"],
    ["Project size", d.projectSize || "–"],
    ["Deadline", d.deadline || "–"],
    ["Budget", d.budget || "–"],
    ["File link", d.fileLink || "–"],
  ]);
  return sent.ok ? { ok: true, ref: d.ref } : sent;
}
