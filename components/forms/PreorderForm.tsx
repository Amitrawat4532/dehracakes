"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useState, type FormEvent } from "react";
import { useCartHydrated } from "@/components/cart/CartView";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ChoiceGroup, Field, Input, QuantityStepper, Select, Textarea } from "@/components/ui/Field";
import { CheckIcon } from "@/components/ui/Icons";
import { formatDisplayDate, formatPrice, isoDateFromToday, timeSlots } from "@/lib/format";
import { submitPreorder } from "@/lib/services/submissions";
import { site } from "@/lib/site";
import { cartSubtotal, useCart } from "@/lib/store/cart";
import type { FulfilmentMethod, PreorderInput, Product } from "@/lib/types";

type Errors = Partial<Record<"name" | "phone" | "email" | "date" | "timeSlot" | "address" | "items", string>>;

const DELIVERY_FEE = 99; // placeholder flat fee

export function PreorderForm({ products }: { products: Product[] }) {
  const id = useId();
  const hydrated = useCartHydrated();
  const cart = useCart();
  const cartTotal = useCart(cartSubtotal);

  // Single-cake selector (used when the cart is empty, or to add one more)
  const [showPicker, setShowPicker] = useState(false);
  const [productId, setProductId] = useState(products[0].id);
  const product = products.find((p) => p.id === productId)!;
  const [sizeId, setSizeId] = useState("1kg");
  const [qty, setQty] = useState(1);
  const [cakeMessage, setCakeMessage] = useState("");

  const [fulfilment, setFulfilment] = useState<FulfilmentMethod>("delivery");
  const [dateInput, setDate] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [confirmation, setConfirmation] = useState<(PreorderInput & { reference: string; total: number }) | null>(null);

  // With an empty cart the single-cake picker is always shown; the date
  // defaults to the one chosen in the cart until the user changes it.
  const pickerVisible = showPicker || cart.items.length === 0;
  const date = dateInput ?? cart.deliveryDate;

  const size = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0];

  const items = useMemo<PreorderInput["items"]>(() => {
    const fromCart = cart.items.map((i) => ({
      productId: i.productId,
      name: i.name,
      sizeLabel: i.sizeLabel,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      message: i.message,
    }));
    if (!pickerVisible) return fromCart;
    return [
      ...fromCart,
      {
        productId: product.id,
        name: product.name,
        sizeLabel: size.label,
        quantity: qty,
        unitPrice: size.price,
        message: cakeMessage.trim() || undefined,
      },
    ];
  }, [cart.items, pickerVisible, product, size, qty, cakeMessage]);

  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.quantity, 0);
  const fee = fulfilment === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + fee;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const input: PreorderInput = {
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      fulfilment,
      date,
      timeSlot: get("timeSlot"),
      address: fulfilment === "delivery" ? get("address") : undefined,
      instructions: get("instructions") || undefined,
      items,
    };

    const next: Errors = {};
    if (input.name.length < 2) next.name = "Please enter your name.";
    if (!/^[+\d][\d\s-]{8,}$/.test(input.phone)) next.phone = "Please enter a valid phone number.";
    if (!/^\S+@\S+\.\S+$/.test(input.email)) next.email = "Please enter a valid email.";
    if (!input.date) next.date = "Choose a date.";
    else if (input.date < isoDateFromToday(1)) next.date = "Pre-orders need at least 24 hours' notice.";
    if (!input.timeSlot) next.timeSlot = "Choose a time slot.";
    if (fulfilment === "delivery" && (input.address ?? "").length < 8) next.address = "Please enter a delivery address.";
    if (items.length === 0) next.items = "Add at least one cake.";
    setErrors(next);
    if (Object.keys(next).length) {
      document.querySelector<HTMLElement>("[role=alert]")?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setStatus("sending");
    const res = await submitPreorder(input);
    setConfirmation({ ...input, reference: res.reference, total });
    cart.clear();
    setStatus("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (confirmation) return <Confirmation data={confirmation} />;

  if (!hydrated) return <div className="mt-12 h-96 animate-pulse rounded-[2rem] bg-cream" />;

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 grid grid-cols-1 gap-10 pb-24 md:mt-12 lg:grid-cols-[1fr_24rem] lg:gap-14 lg:pb-0">
      <div className="space-y-10 md:space-y-12">
        {/* 1 — Cakes */}
        <fieldset>
          <legend className="font-display text-[1.75rem] text-espresso md:text-3xl">
            <span className="mr-3 font-sans text-xs tabular-nums text-caramel">01</span>Your cakes
          </legend>

          {cart.items.length > 0 ? (
            <ul className="mt-6 divide-y divide-espresso/10 rounded-[1.5rem] bg-card px-5 shadow-soft">
              {cart.items.map((i) => (
                <li key={i.key} className="flex items-center gap-4 py-4">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                    <Image src={i.image.src} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-espresso">{i.name}</span>
                    <span className="block text-xs text-mocha">
                      {i.sizeLabel} × {i.quantity}
                      {i.message ? ` · “${i.message}”` : ""}
                    </span>
                  </span>
                  <span className="text-sm tabular-nums text-espresso">{formatPrice(i.unitPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {cart.items.length > 0 && !pickerVisible ? (
            <div className="mt-4 flex gap-5 text-sm">
              <button type="button" onClick={() => setShowPicker(true)} className="text-espresso underline underline-offset-4">+ Add another cake</button>
              <Link href="/cart" className="text-mocha underline underline-offset-4">Edit cart</Link>
            </div>
          ) : null}

          {pickerVisible ? (
            <div className="mt-6 space-y-6 rounded-[1.5rem] border border-espresso/10 bg-card/50 p-4 md:p-7">
              <div className="grid grid-cols-[1fr_auto] gap-3 md:gap-5">
                <Field label="Cake" htmlFor={`${id}-cake`}>
                  <Select id={`${id}-cake`} value={productId} onChange={(e) => setProductId(e.target.value)}>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Quantity">
                  <QuantityStepper value={qty} onChange={setQty} />
                </Field>
              </div>
              <Field label="Size" hint={`Serves ${size.serves}`}>
                <ChoiceGroup
                  name="Size"
                  value={size.id}
                  onChange={setSizeId}
                  options={product.sizes.map((s) => ({ value: s.id, label: s.label, sub: formatPrice(s.price) }))}
                />
              </Field>
              <Field label="Message on the cake" hint="Optional" htmlFor={`${id}-cakemsg`}>
                <Input id={`${id}-cakemsg`} maxLength={32} value={cakeMessage} onChange={(e) => setCakeMessage(e.target.value)} placeholder="Happy Anniversary" />
              </Field>
              {cart.items.length > 0 ? (
                <button type="button" onClick={() => setShowPicker(false)} className="text-sm text-mocha underline underline-offset-4">Remove this cake</button>
              ) : null}
            </div>
          ) : null}
          {errors.items ? <p role="alert" className="mt-2 text-xs text-rose">{errors.items}</p> : null}
        </fieldset>

        {/* 2 — When & where */}
        <fieldset>
          <legend className="font-display text-[1.75rem] text-espresso md:text-3xl">
            <span className="mr-3 font-sans text-xs tabular-nums text-caramel">02</span>When &amp; where
          </legend>
          <div className="mt-6 space-y-6">
            <ChoiceGroup
              name="Fulfilment"
              columns="grid-cols-2"
              value={fulfilment}
              onChange={setFulfilment}
              options={[
                { value: "delivery", label: "Delivery", sub: `Across Dehradun · ${formatPrice(DELIVERY_FEE)}` },
                { value: "pickup", label: "Pickup", sub: "From our studio · free" },
              ]}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={fulfilment === "delivery" ? "Delivery date" : "Pickup date"} htmlFor={`${id}-date`} error={errors.date}>
                <Input id={`${id}-date`} type="date" min={isoDateFromToday(1)} value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
              <Field label="Preferred time" htmlFor={`${id}-time`} error={errors.timeSlot}>
                <Select id={`${id}-time`} name="timeSlot" defaultValue="">
                  <option value="" disabled>Choose a slot</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </Field>
            </div>
            {fulfilment === "delivery" ? (
              <Field label="Delivery address" hint="Dehradun only" htmlFor={`${id}-address`} error={errors.address}>
                <Textarea id={`${id}-address`} name="address" rows={2} autoComplete="street-address" placeholder="House, street, locality" />
              </Field>
            ) : (
              <p className="rounded-2xl bg-cream px-5 py-4 text-sm text-cocoa">
                Pickup from <strong className="font-medium text-espresso">Dehra Cakes Studio</strong>, {site.address.street}, {site.address.locality}.
              </p>
            )}
          </div>
        </fieldset>

        {/* 3 — Contact */}
        <fieldset>
          <legend className="font-display text-[1.75rem] text-espresso md:text-3xl">
            <span className="mr-3 font-sans text-xs tabular-nums text-caramel">03</span>Your details
          </legend>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Name" htmlFor={`${id}-name`} error={errors.name} className="sm:col-span-2">
              <Input id={`${id}-name`} name="name" autoComplete="name" />
            </Field>
            <Field label="Phone" htmlFor={`${id}-phone`} error={errors.phone}>
              <Input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" />
            </Field>
            <Field label="Email" htmlFor={`${id}-email`} error={errors.email}>
              <Input id={`${id}-email`} name="email" type="email" autoComplete="email" />
            </Field>
            <Field label="Additional instructions" hint="Optional" htmlFor={`${id}-instr`} className="sm:col-span-2">
              <Textarea id={`${id}-instr`} name="instructions" rows={3} placeholder="Eggless, less sweet, candles, a surprise delivery…" />
            </Field>
          </div>
        </fieldset>
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-[2rem] bg-card p-7 shadow-soft lg:sticky lg:top-24">
        <h2 className="font-display text-2xl text-espresso">Order summary</h2>
        <ul className="mt-5 space-y-3 text-sm">
          {items.map((i, n) => (
            <li key={n} className="flex justify-between gap-4">
              <span className="text-cocoa">{i.name} · {i.sizeLabel} × {i.quantity}</span>
              <span className="tabular-nums text-espresso">{formatPrice(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-espresso/10 pt-5 text-sm">
          <div className="flex justify-between"><dt className="text-cocoa">Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal || cartTotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-cocoa">{fulfilment === "delivery" ? "Delivery" : "Pickup"}</dt><dd className="tabular-nums">{fee ? formatPrice(fee) : "Free"}</dd></div>
          {date ? <div className="flex justify-between"><dt className="text-cocoa">Date</dt><dd>{formatDisplayDate(date)}</dd></div> : null}
        </dl>
        <div className="mt-5 flex items-baseline justify-between border-t border-espresso/10 pt-5">
          <span className="text-cocoa">Total</span>
          <span className="font-display text-3xl tabular-nums text-espresso">{formatPrice(total)}</span>
        </div>
        <Button type="submit" size="lg" className="mt-7 w-full max-lg:hidden" disabled={status === "sending"} magnetic>
          {status === "sending" ? "Placing pre-order…" : "Place Pre-order"}
        </Button>
        <p className="mt-4 text-center text-xs leading-relaxed text-mocha">Pay on confirmation. Delivery fee is a placeholder.</p>
      </aside>

      {/* Phone checkout bar — total and the primary action stay under the thumb */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-espresso/10 bg-ivory/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1 leading-tight">
            <p className="text-[0.7rem] text-mocha">
              {items.reduce((n, i) => n + i.quantity, 0)} item{items.reduce((n, i) => n + i.quantity, 0) === 1 ? "" : "s"} · {fulfilment === "delivery" ? "Delivery" : "Pickup"}
            </p>
            <p className="font-display text-2xl tabular-nums text-espresso">{formatPrice(total)}</p>
          </div>
          <Button type="submit" size="lg" disabled={status === "sending"} className="!px-6">
            {status === "sending" ? "Placing…" : "Place Pre-order"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Confirmation({ data }: { data: PreorderInput & { reference: string; total: number } }) {
  return (
    <div className="mt-12 overflow-hidden rounded-[2rem] bg-card shadow-soft" role="status">
      <div className="bg-espresso px-7 py-10 text-ivory md:px-12 md:py-14">
        <span className="grid size-14 place-items-center rounded-full bg-ivory text-espresso">
          <CheckIcon size={24} />
        </span>
        <h2 className="font-display mt-8 text-[clamp(2.4rem,5vw,4rem)] font-[340]">Thank you, {data.name.split(" ")[0]}.</h2>
        <p className="mt-3 max-w-lg text-ivory/75">
          Your pre-order is in. We&apos;ll call {data.phone} to confirm the details within a few hours.
        </p>
        <p className="eyebrow mt-8 text-caramel-soft">Reference · {data.reference}</p>
      </div>
      <div className="grid gap-8 px-7 py-10 md:grid-cols-2 md:px-12">
        <div>
          <h3 className="eyebrow text-caramel">Cakes</h3>
          <ul className="mt-4 space-y-3">
            {data.items.map((i, n) => (
              <li key={n} className="flex justify-between gap-4 text-sm">
                <span className="text-espresso">
                  {i.name} · {i.sizeLabel} × {i.quantity}
                  {i.message ? <span className="block text-xs italic text-mocha">“{i.message}”</span> : null}
                </span>
                <span className="tabular-nums">{formatPrice(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex justify-between border-t border-espresso/10 pt-4 font-medium text-espresso">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(data.total)}</span>
          </p>
        </div>
        <div>
          <h3 className="eyebrow text-caramel">{data.fulfilment === "delivery" ? "Delivery" : "Pickup"}</h3>
          <p className="mt-4 text-sm leading-relaxed text-espresso">
            {formatDisplayDate(data.date)} · {data.timeSlot}
            <br />
            {data.fulfilment === "delivery" ? data.address : `Dehra Cakes Studio, ${site.address.locality}`}
          </p>
          {data.instructions ? <p className="mt-3 text-sm italic text-mocha">“{data.instructions}”</p> : null}
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-espresso/10 px-7 py-6 sm:flex-row sm:items-center sm:justify-between md:px-12">
        <p className="text-xs text-mocha">Demo: this pre-order was saved in your browser only. Nothing was sent or charged.</p>
        <ButtonLink href="/" variant="outline">Back to home</ButtonLink>
      </div>
    </div>
  );
}
