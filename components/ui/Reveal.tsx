"use client";

import { Fragment, useEffect, useRef, type ReactNode, type CSSProperties } from "react";

/**
 * Sets `data-inview="true"` once the element enters the viewport.
 * Pair with the `.reveal-*` CSS classes in globals.css — the animation itself
 * is pure CSS, so this costs one shared IntersectionObserver.
 */
let observer: IntersectionObserver | null = null;
function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.inview = "true";
          observer?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
  );
  return observer;
}

type RevealProps = {
  as?: "div" | "section" | "figure" | "li" | "article";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  id?: string;
};

export function Reveal({ as: Tag = "div", className, style, children, id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return (
    <Tag ref={ref as React.Ref<never>} className={className} style={style} id={id} data-inview="false">
      {children}
    </Tag>
  );
}

/** Splits text into word spans for the `.reveal-words` masked rise effect. */
export function SplitWords({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={`reveal-words ${className ?? ""}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="w" style={{ "--i": i } as CSSProperties}>
            <span>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
