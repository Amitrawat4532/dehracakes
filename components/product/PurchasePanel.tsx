"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChoiceGroup, Field, Input, QuantityStepper } from "@/components/ui/Field";
import { CalendarIcon, CheckIcon, LeafIcon, TruckIcon } from "@/components/ui/Icons";
import { formatPrice, isoDateFromToday } from "@/lib/format";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/types";

const MESSAGE_MAX = 32;

export function PurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const setDeliveryDate = useCart((s) => s.setDeliveryDate);
  const storedDate = useCart((s) => s.deliveryDate);
  const cartOpen = useCart((s) => s.isOpen);

  const [sizeId, setSizeId] = useState(product.sizes.find((s) => s.id === "1kg")?.id ?? product.sizes[0].id);
  const [quantity, setQuantity] = useState(1);
  const [dateInput, setDate] = useState<string | null>(null);
  const date = dateInput ?? storedDate;
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  const size = product.sizes.find((s) => s.id === sizeId)!;
  const total = size.price * quantity;
  const minDate = isoDateFromToday(1);

  // Mobile sticky bar shows whenever the main actions are off screen.
  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function addToCart() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      sizeId: size.id,
      sizeLabel: size.label,
      unitPrice: size.price,
      quantity,
      message: message.trim() || undefined,
    });
    if (date) setDeliveryDate(date);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <p className="font-display text-4xl font-[380] tabular-nums text-espresso">{formatPrice(total)}</p>
        {quantity > 1 ? <p className="text-sm text-mocha">{formatPrice(size.price)} each</p> : null}
      </div>
      <p className="mt-1 text-xs text-mocha">Demo pricing · inclusive of taxes</p>

      <div className="mt-7 space-y-6 md:mt-9 md:space-y-7">
        <Field label="Size" hint={`Serves ${size.serves}`}>
          <ChoiceGroup
            name="Size"
            value={sizeId}
            onChange={setSizeId}
            options={product.sizes.map((s) => ({ value: s.id, label: s.label, sub: formatPrice(s.price) }))}
          />
        </Field>

        <div className="grid grid-cols-[auto_1fr] gap-4 md:gap-5">
          <Field label="Quantity">
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </Field>
          <Field label="Delivery / pickup date" htmlFor="pdp-date">
            <Input id="pdp-date" type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>

        <Field label="Message on the cake" hint={`${message.length}/${MESSAGE_MAX}`} htmlFor="pdp-message">
          <Input
            id="pdp-message"
            value={message}
            maxLength={MESSAGE_MAX}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Happy Birthday, Maa"
          />
        </Field>
      </div>

      <div ref={actionsRef} className="mt-8 grid grid-cols-2 gap-3 md:mt-9">
        <Button size="lg" onClick={addToCart} magnetic aria-live="polite">
          {added ? <CheckIcon size={18} /> : null}
          {added ? "Added to cart" : "Add to cart"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            addToCart();
            useCart.getState().close();
            router.push("/preorder");
          }}
        >
          Buy now
        </Button>
      </div>

      <ul className="mt-9 grid gap-3 border-t border-espresso/10 pt-7 text-sm text-cocoa">
        <li className="flex items-center gap-3"><TruckIcon size={18} className="text-caramel" /> Delivery across Dehradun, or pickup from our studio</li>
        <li className="flex items-center gap-3"><CalendarIcon size={18} className="text-caramel" /> Pre-order up to 30 days ahead · 24 h notice</li>
        {product.eggless ? (
          <li className="flex items-center gap-3"><LeafIcon size={18} className="text-caramel" /> Available eggless at no extra cost</li>
        ) : null}
      </ul>

      {/* Mobile sticky purchase bar */}
      <div
        className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 transition-all duration-500 ease-[var(--ease-out-expo)] md:hidden ${
          showBar && !cartOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-full bg-espresso/95 p-1.5 pl-5 text-ivory shadow-lift ring-1 ring-ivory/10 backdrop-blur-md">
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[0.7rem] text-ivory/60">{product.name} · {size.label}</p>
            <p className="text-sm font-medium tabular-nums">{formatPrice(total)}</p>
          </div>
          <button type="button" onClick={addToCart} className="rounded-full bg-ivory px-6 py-3 text-sm font-medium text-espresso active:scale-95">
            {added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
