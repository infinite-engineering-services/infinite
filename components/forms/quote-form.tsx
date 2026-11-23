"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowRight, Check, CircleCheck, LoaderCircle } from "lucide-react";
import { addQuoteDetails, submitQuote } from "@/app/actions/quote";
import { WhatsAppIcon } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { promises, site, whatsappLink } from "@/config/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  budgetOptions,
  fileTypeOptions,
  quoteDetailsSchema,
  quoteSchema,
  serviceOptions,
  type QuoteDetails,
  type QuoteInput,
} from "./quote-schema";

const field =
  "h-12 rounded-xl border-input bg-ink/[0.04] px-4 text-base md:text-base shadow-none placeholder:text-muted-foreground/80 focus-visible:border-map focus-visible:ring-[3px] focus-visible:ring-map/25 aria-invalid:border-destructive";
const labelCls = "t-mono mb-2 text-[11px] text-muted-foreground";

function Err({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[14px] text-destructive">
      {msg}
    </p>
  );
}

type FormIn = z.input<typeof quoteSchema>;

type Lead = Pick<QuoteInput, "name" | "email" | "services" | "message">;

/** A ready-to-send WhatsApp message with everything the visitor entered. */
function leadMessage(lead: Partial<Lead>, refId?: string, extra?: Partial<QuoteDetails>) {
  const clip = (t: string, n: number) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);
  const lines = [
    refId
      ? `Hi ${site.name}, I've just sent a project request on your website.`
      : `Hi ${site.name}, I'd like to discuss a project.`,
    "",
    refId ? `Reference: ${refId}` : "",
    lead.name ? `Name: ${lead.name}` : "",
    lead.email ? `Email: ${lead.email}` : "",
    lead.services?.length ? `Services: ${lead.services.join(", ")}` : "",
    lead.message ? `Project: ${clip(lead.message.trim(), 600)}` : "",
    extra?.company ? `Company: ${extra.company}` : "",
    extra?.phone ? `Phone: ${extra.phone}` : "",
    extra?.fileType ? `Input files: ${extra.fileType}` : "",
    extra?.projectSize ? `Project size: ${extra.projectSize}` : "",
    extra?.deadline ? `Deadline: ${extra.deadline}` : "",
    extra?.budget ? `Budget: ${extra.budget}` : "",
    extra?.fileLink ? `Files: ${extra.fileLink}` : "",
  ];
  return lines.filter((l, i) => l !== "" || i === 1).join("\n");
}

/** Two steps: a four-field lead first, optional scoping details after. */
export function QuoteForm() {
  const uid = useId();
  const [pending, startTransition] = useTransition();
  const [ref, setRef] = useState<string | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    setFocus,
    getValues,
    control,
    formState: { errors },
  } = useForm<FormIn, unknown, QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      services: [],
      consent: false as unknown as true,
      website: "",
      startedAt: 0,
    },
    mode: "onTouched",
  });

  // Time trap: record when the form became interactive
  useEffect(() => {
    setValue("startedAt", Date.now());
  }, [setValue]);

  const selected = useWatch({ control, name: "services" }) ?? [];

  const onValid = (data: QuoteInput) => {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await submitQuote(data);
      if (res.ok) {
        track("quote_submit", { services: data.services.join("|") });
        setLead({ name: data.name, email: data.email, services: data.services, message: data.message });
        setRef(res.ref);
      } else {
        if (res.fieldErrors) {
          const keys = Object.keys(res.fieldErrors) as (keyof QuoteInput)[];
          keys.forEach((k) => setError(k, { message: res.fieldErrors![k] }));
          if (keys[0]) setFocus(keys[0]);
        }
        setErrorMsg(res.message);
      }
    });
  };

  const onInvalid = (errs: FieldErrors<FormIn>) => {
    const first = Object.keys(errs)[0];
    if (first === "services") document.getElementById(`${uid}-services`)?.focus();
  };

  if (ref) return <Details refId={ref} lead={lead} />;

  const e = errors;
  const a = (k: keyof FormIn) => ({
    "aria-invalid": e[k] ? true : undefined,
    "aria-describedby": e[k] ? `${uid}-${k}-err` : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate className="grid gap-5">
      <p className="t-mono -mb-1 text-[11px] text-muted-foreground">Step 1 of 2 · step 2 is optional</p>
      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>
      <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${uid}-name`} className={labelCls}>
            01 · Your name
          </Label>
          <Input id={`${uid}-name`} autoComplete="name" className={field} {...register("name")} {...a("name")} />
          <Err id={`${uid}-name-err`} msg={e.name?.message} />
        </div>
        <div>
          <Label htmlFor={`${uid}-email`} className={labelCls}>
            02 · Work email
          </Label>
          <Input
            id={`${uid}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            className={field}
            {...register("email")}
            {...a("email")}
          />
          <Err id={`${uid}-email-err`} msg={e.email?.message} />
        </div>
      </div>

      <fieldset aria-describedby={e.services ? `${uid}-services-err` : undefined}>
        <legend id={`${uid}-services`} tabIndex={-1} className={cn(labelCls, "block")}>
          03 · What do you need?
        </legend>
        <div className="flex flex-wrap gap-2">
          {serviceOptions.map((s) => {
            const on = selected.includes(s);
            return (
              <label
                key={s}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-[14px] font-medium transition-colors select-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]",
                  on
                    ? "border-map bg-map text-void"
                    : "border-input bg-ink/[0.03] text-foreground hover:border-foreground/60",
                )}
              >
                <input type="checkbox" value={s} className="sr-only" {...register("services")} />
                {on ? <Check className="size-3.5" aria-hidden /> : null}
                {s}
              </label>
            );
          })}
        </div>
        <Err id={`${uid}-services-err`} msg={e.services?.message} />
      </fieldset>

      <div>
        <Label htmlFor={`${uid}-message`} className={labelCls}>
          04 · What do you have? (optional)
        </Label>
        <Textarea
          id={`${uid}-message`}
          rows={3}
          placeholder="e.g. E57 scans of a 3-storey office, need Revit LOD 300 in 2 weeks"
          className={cn(field, "h-auto min-h-24 py-3")}
          {...register("message")}
        />
      </div>

      <div>
        <label className="flex items-start gap-3 text-[14px] leading-6 text-muted-foreground">
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-[#f4c430]"
            {...register("consent")}
            {...a("consent")}
          />
          <span>
            {site.legalName} may use these details to reply to this enquiry, as
            described in our{" "}
            <a href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-ink">
              Privacy Policy
            </a>
            . We never sell or share them for marketing.
          </span>
        </label>
        <Err id={`${uid}-consent-err`} msg={e.consent?.message} />
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-[14px]">
          {error}{" "}
          <a
            href={whatsappLink(leadMessage(getValues() as Partial<Lead>))}
            onClick={() => track("whatsapp_click", { from: "quote_error" })}
            className="font-medium underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Send these details on WhatsApp
          </a>
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? (
            <>
              <LoaderCircle className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send project details <ArrowRight />
            </>
          )}
        </Button>
        <p className="text-[14px] text-muted-foreground">
          {promises.replyShort} · {promises.ndaShort}
        </p>
      </div>
    </form>
  );
}

/* ── Step 2 ──────────────────────────────────────────────────── */
type DetailsIn = z.input<typeof quoteDetailsSchema>;

function Details({ refId, lead }: { refId: string; lead: Lead | null }) {
  const uid = useId();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [extra, setExtra] = useState<Partial<QuoteDetails> | undefined>();
  const [error, setErrorMsg] = useState<string | null>(null);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors: e },
  } = useForm<DetailsIn, unknown, QuoteDetails>({
    resolver: zodResolver(quoteDetailsSchema),
    defaultValues: { ref: refId, phone: "", budget: "" },
    mode: "onTouched",
  });

  const onValid = (data: QuoteDetails) => {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await addQuoteDetails(data);
      if (res.ok) {
        setExtra(data);
        setDone(true);
      }
      else {
        if (res.fieldErrors)
          for (const [k, v] of Object.entries(res.fieldErrors))
            setError(k as keyof DetailsIn, { message: v });
        setErrorMsg(res.message);
      }
    });
  };

  return (
    <div role="status" className="grid gap-6">
      <div className="flex items-start gap-4">
        <CircleCheck className="mt-0.5 size-8 shrink-0 text-[#25d366]" aria-hidden />
        <div>
          <h3 className="font-display text-2xl font-medium">Request received.</h3>
          <p className="mt-1.5 text-[15px] leading-6 text-muted-foreground">
            Your reference is <span className="font-mono text-foreground">{refId}</span>.{" "}
            {promises.reply} For a faster answer, send the same details to an engineer on
            WhatsApp: the message is already written, just press send.
          </p>
          <Button asChild className="mt-4 bg-[#25d366] text-[#06140b] hover:bg-[#3ee07a]">
            <a
              href={whatsappLink(leadMessage(lead ?? {}, refId, extra))}
              onClick={() => track("whatsapp_click", { from: "quote_success" })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="size-4" /> Send these details on WhatsApp
            </a>
          </Button>
        </div>
      </div>

      {done ? (
        <p className="rounded-xl border bg-ink/[0.04] p-4 text-[15px]">
          <Check className="mr-1.5 inline size-4 text-[#25d366]" aria-hidden />
          Details added to {refId}. Thank you, that helps us scope faster. The WhatsApp
          message above now includes them too.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onValid)} noValidate className="grid gap-5 rounded-2xl border bg-ink/[0.03] p-5 sm:p-6">
          <div>
            <p className="t-mono text-[11px] text-muted-foreground">Step 2 of 2 · optional</p>
            <h4 className="mt-1 font-display text-xl font-medium">Help us scope faster</h4>
            <p className="mt-1 text-[14px] text-muted-foreground">Every field can be left empty.</p>
          </div>
          <input type="hidden" {...register("ref")} />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor={`${uid}-company`} className={labelCls}>Company</Label>
              <Input id={`${uid}-company`} autoComplete="organization" className={field} {...register("company")} />
            </div>
            <div>
              <Label htmlFor={`${uid}-phone`} className={labelCls}>Phone or WhatsApp</Label>
              <Input
                id={`${uid}-phone`}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+1 555 010 0000"
                className={field}
                aria-invalid={e.phone ? true : undefined}
                {...register("phone")}
              />
              <Err id={`${uid}-phone-err`} msg={e.phone?.message} />
            </div>
            <div>
              <Label htmlFor={`${uid}-fileType`} className={labelCls}>Input files</Label>
              <select id={`${uid}-fileType`} defaultValue="" className={cn(field, "w-full border [&>option]:bg-[#121816]")} {...register("fileType")}>
                <option value="">Select…</option>
                {fileTypeOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor={`${uid}-projectSize`} className={labelCls}>Project size</Label>
              <Input id={`${uid}-projectSize`} placeholder="25,000 sq ft · 40 km · 30 sheets" className={field} {...register("projectSize")} />
            </div>
            <div>
              <Label htmlFor={`${uid}-deadline`} className={labelCls}>Deadline</Label>
              <Input id={`${uid}-deadline`} type="date" className={field} {...register("deadline")} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor={`${uid}-budget`} className="t-mono text-[11px] text-muted-foreground">Budget</Label>
                <div role="group" aria-label="Currency" className="inline-flex rounded-full border p-0.5 text-[12px]">
                  {(["INR", "USD"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={currency === c}
                      onClick={() => setCurrency(c)}
                      className={cn("rounded-full px-2.5 py-0.5", currency === c ? "bg-foreground text-background" : "text-muted-foreground")}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <select id={`${uid}-budget`} defaultValue="" className={cn(field, "w-full border [&>option]:bg-[#121816]")} {...register("budget")}>
                <option value="">Prefer not to say</option>
                {budgetOptions[currency].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor={`${uid}-fileLink`} className={labelCls}>File link (Drive, WeTransfer, Dropbox)</Label>
              <Input
                id={`${uid}-fileLink`}
                type="url"
                inputMode="url"
                placeholder="https://"
                className={field}
                aria-invalid={e.fileLink ? true : undefined}
                {...register("fileLink")}
              />
              <Err id={`${uid}-fileLink-err`} msg={e.fileLink?.message} />
            </div>
          </div>
          {error ? (
            <p role="alert" className="text-[14px] text-destructive">{error}</p>
          ) : null}
          <div>
            <Button type="submit" variant="secondary" disabled={pending}>
              {pending ? <LoaderCircle className="animate-spin" /> : null} Add details
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
