"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type DragEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ChoiceGroup, Field, Input, Textarea } from "@/components/ui/Field";
import { CheckIcon, CloseIcon, UploadIcon } from "@/components/ui/Icons";
import { formatDisplayDate, isoDateFromToday } from "@/lib/format";
import { submitCustomCakeEnquiry } from "@/lib/services/submissions";

const flavours = ["Belgian Chocolate", "Vanilla Bean", "Red Velvet", "Butterscotch", "Fresh Fruit", "Not sure yet"] as const;
const sizes = [
  { value: "1kg", label: "1 kg", sub: "8–10 people" },
  { value: "2kg", label: "2 kg", sub: "16–20 people" },
  { value: "3kg", label: "3 kg", sub: "Two tiers" },
  { value: "5kg+", label: "5 kg +", sub: "Weddings & events" },
] as const;

type Size = (typeof sizes)[number]["value"];
type Errors = Partial<Record<"name" | "phone" | "date" | "message" | "file", string>>;

const MAX_FILE = 8 * 1024 * 1024;

export function CustomCakeForm() {
  const id = useId();
  const [flavour, setFlavour] = useState<string>(flavours[0]);
  const [size, setSize] = useState<Size>("2kg");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [result, setResult] = useState<{ reference: string; date: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const minDate = isoDateFromToday(3);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function acceptFile(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, file: "Please choose an image (JPG, PNG, WebP or HEIC)." }));
      return;
    }
    if (f.size > MAX_FILE) {
      setErrors((e) => ({ ...e, file: "That image is over 8 MB — try a smaller one." }));
      return;
    }
    setErrors((e) => ({ ...e, file: undefined }));
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const date = String(data.get("date") ?? "");
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (name.length < 2) next.name = "Please tell us your name.";
    if (!/^[+\d][\d\s-]{8,}$/.test(phone)) next.phone = "Please enter a valid phone number.";
    if (!date) next.date = "Choose your preferred date.";
    else if (date < minDate) next.date = "Custom cakes need at least 3 days' notice.";
    if (message.length < 10) next.message = "A few words about your idea help us quote accurately.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    const res = await submitCustomCakeEnquiry({
      name,
      phone,
      flavour,
      size,
      date,
      message,
      inspirationFileName: file?.name,
    });
    setResult({ reference: res.reference, date });
    setStatus("done");
  }

  if (status === "done" && result) {
    return (
      <div className="flex min-h-[32rem] flex-col items-start justify-center rounded-[2rem] bg-card p-8 shadow-soft md:p-12" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-espresso text-ivory">
          <CheckIcon size={24} />
        </span>
        <h3 className="font-display mt-8 text-4xl font-[380] text-espresso">Your idea is with us.</h3>
        <p className="mt-4 max-w-md leading-relaxed text-cocoa">
          Our cake designer will call you within one working day with a sketch and a quote for{" "}
          <strong className="font-medium text-espresso">{formatDisplayDate(result.date)}</strong>.
        </p>
        <p className="eyebrow mt-8 text-mocha">Reference · {result.reference}</p>
        <p className="mt-6 text-xs text-mocha/70">Demo: this enquiry was saved in your browser only. No message was sent.</p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            setStatus("idle");
            setFile(null);
            setPreview(null);
          }}
        >
          Plan another cake
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-[1.75rem] bg-card/90 p-5 shadow-soft ring-1 ring-espresso/5 md:rounded-[2rem] md:p-10">
      {/* Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative flex min-h-[9.5rem] items-center gap-5 rounded-3xl border border-dashed p-5 transition-colors duration-300 ${
          dragging ? "border-caramel bg-caramel/8" : "border-espresso/20 bg-ivory/60"
        }`}
      >
        {preview ? (
          <>
            <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl">
              <Image src={preview} alt="Your inspiration image" fill unoptimized className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-espresso">{file?.name}</p>
              <p className="mt-1 text-xs text-mocha">Looks lovely. We&apos;ll use this as a starting point.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="grid size-9 shrink-0 place-items-center rounded-full text-cocoa hover:bg-espresso/8"
              aria-label="Remove image"
            >
              <CloseIcon size={18} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex w-full items-center gap-5 text-left"
          >
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-espresso text-ivory">
              <UploadIcon size={22} />
            </span>
            <span>
              <span className="block font-medium text-espresso">Upload an inspiration image</span>
              <span className="mt-1 block text-sm text-mocha">Drag &amp; drop or browse · a screenshot, sketch or Pinterest find</span>
            </span>
          </button>
        )}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="sr-only"
          tabIndex={-1}
          aria-label="Inspiration image"
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />
      </div>
      {errors.file ? <p role="alert" className="mt-2 text-xs text-rose">{errors.file}</p> : null}

      <div className="mt-8 space-y-7">
        <Field label="Flavour">
          <div className="flex flex-wrap gap-2">
            {flavours.map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setFlavour(f)}
                aria-pressed={flavour === f}
                className={`rounded-full border px-4 py-2.5 text-sm transition-all duration-300 active:scale-95 ${
                  flavour === f ? "border-espresso bg-espresso text-ivory" : "border-espresso/15 text-cocoa hover:border-espresso/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Size">
          <ChoiceGroup name="Size" options={[...sizes]} value={size} onChange={setSize} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" htmlFor={`${id}-name`} error={errors.name}>
            <Input id={`${id}-name`} name="name" autoComplete="name" placeholder="Full name" />
          </Field>
          <Field label="Phone" htmlFor={`${id}-phone`} error={errors.phone}>
            <Input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91" />
          </Field>
        </div>

        <Field label="Preferred date" hint="At least 3 days ahead" htmlFor={`${id}-date`} error={errors.date}>
          <Input id={`${id}-date`} name="date" type="date" min={minDate} />
        </Field>

        <Field label="Tell us about it" htmlFor={`${id}-message`} error={errors.message}>
          <Textarea
            id={`${id}-message`}
            name="message"
            rows={4}
            placeholder="The occasion, colours, a theme, the message on the cake…"
          />
        </Field>
      </div>

      <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-mocha">No payment now. We&apos;ll confirm design &amp; price by phone.</p>
        <Button type="submit" size="lg" magnetic disabled={status === "sending"} className="max-sm:w-full">
          {status === "sending" ? "Sending…" : "Request a Custom Cake"}
        </Button>
      </div>
    </form>
  );
}
