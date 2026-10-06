import type { CakeChannels } from "@/components/three/cake/CakeModel";

/** The five beats of the "Made layer by layer" section, as scroll ranges. */
export const layerSteps = [
  {
    n: "01",
    title: "Sponge",
    body: "Three layers of golden vanilla sponge, baked the same morning and levelled by hand.",
    detail: "Baked fresh daily",
    start: 0,
    end: 0.2,
  },
  {
    n: "02",
    title: "Cream",
    body: "Whipped vanilla-bean cream, folded slowly so it stays light and never too sweet.",
    detail: "Real vanilla bean",
    start: 0.2,
    end: 0.38,
  },
  {
    n: "03",
    title: "Chocolate filling",
    body: "A thin, silky layer of Belgian dark chocolate ganache between every tier.",
    detail: "Belgian dark chocolate",
    start: 0.38,
    end: 0.58,
  },
  {
    n: "04",
    title: "Decoration",
    body: "Smooth ivory buttercream, a hand-poured ganache drip, piped rosettes and fresh strawberries.",
    detail: "Finished by hand",
    start: 0.58,
    end: 0.84,
  },
  {
    n: "05",
    title: "Finished cake",
    body: "Boxed with care and ready for your table — for delivery across Dehradun or pickup.",
    detail: "Ready for your moment",
    start: 0.84,
    end: 1.01,
  },
] as const;

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function layerChannels(p: number, out: CakeChannels): CakeChannels {
  out.sponge = ss(0.02, 0.17, p);
  out.cream = ss(0.22, 0.34, p);
  out.ganache = ss(0.41, 0.53, p);
  out.explode = 1 - ss(0.6, 0.7, p);
  out.coat = ss(0.66, 0.76, p);
  out.drip = ss(0.73, 0.81, p);
  out.toppings = ss(0.77, 0.88, p);
  return out;
}

export function activeLayerStep(p: number) {
  const i = layerSteps.findIndex((s) => p >= s.start && p < s.end);
  return i === -1 ? layerSteps.length - 1 : i;
}
