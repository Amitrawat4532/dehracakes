"use client";

import Link from "next/link";
import {
  useRef,
  type ComponentProps,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2.5 rounded-full font-medium tracking-[0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-expo)] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary:
    "bg-espresso text-ivory shadow-[0_10px_30px_-12px_rgb(42_26_18/0.6)] hover:bg-cocoa hover:shadow-[0_18px_40px_-14px_rgb(42_26_18/0.65)]",
  outline:
    "border border-espresso/25 text-espresso hover:border-espresso hover:bg-espresso hover:text-ivory",
  ghost: "text-espresso hover:bg-espresso/5",
  light: "bg-ivory text-espresso hover:bg-white",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-[0.95rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

/**
 * Magnetic hover: the button drifts toward the cursor (fine pointers only).
 * Uses direct style writes in rAF — no React re-renders.
 */
function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null);
  const frame = useRef(0);

  const onPointerMove = (e: ReactPointerEvent<T>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };
  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transform = "";
  };
  return { ref, onPointerMove, onPointerLeave };
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  children: ReactNode;
  className?: string;
};

export function ButtonLink({
  variant,
  size,
  magnetic,
  children,
  className = "",
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  const m = useMagnetic<HTMLAnchorElement>();
  return (
    <Link
      {...props}
      ref={magnetic ? m.ref : undefined}
      onPointerMove={magnetic ? m.onPointerMove : undefined}
      onPointerLeave={magnetic ? m.onPointerLeave : undefined}
      className={buttonClasses(variant, size, className)}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant,
  size,
  magnetic,
  children,
  className = "",
  type = "button",
  ...props
}: CommonProps & ComponentProps<"button">) {
  const m = useMagnetic<HTMLButtonElement>();
  return (
    <button
      {...props}
      type={type}
      ref={magnetic ? m.ref : undefined}
      onPointerMove={magnetic ? m.onPointerMove : undefined}
      onPointerLeave={magnetic ? m.onPointerLeave : undefined}
      className={buttonClasses(variant, size, className)}
    >
      {children}
    </button>
  );
}
