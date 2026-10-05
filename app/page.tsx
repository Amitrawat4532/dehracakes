import { CustomCake } from "@/components/sections/CustomCake";
import { FeaturedCakes } from "@/components/sections/FeaturedCakes";
import { Hero } from "@/components/sections/Hero";
import { LayerStory } from "@/components/sections/LayerStory";
import { LocalDehradun } from "@/components/sections/LocalDehradun";
import { Occasions } from "@/components/sections/Occasions";
import { Trust } from "@/components/sections/Trust";
import { HomeStage } from "@/components/three/HomeStage";
import { getOccasions, getProducts } from "@/lib/services/catalog";

export default async function HomePage() {
  const [products, occasions] = await Promise.all([getProducts(), getOccasions()]);

  return (
    <>
      {/* One shared WebGL canvas for the whole page (hero + layer story) */}
      <HomeStage />
      <Hero />
      <FeaturedCakes products={products} />
      <LayerStory />
      <Occasions occasions={occasions} />
      <CustomCake />
      <Trust />
      <LocalDehradun />
    </>
  );
}
