import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grid min-h-svh place-items-center px-5 pt-[var(--nav-h)] text-center">
      <div>
        <p className="eyebrow text-caramel">404</p>
        <h1 className="font-display mt-4 text-[clamp(2.8rem,7vw,6rem)] font-[340] text-espresso">
          This slice is <em className="text-cocoa">missing.</em>
        </h1>
        <p className="mt-4 text-cocoa">The page you&apos;re looking for has been eaten — or never existed.</p>
        <ButtonLink href="/cakes" className="mt-8">Browse cakes</ButtonLink>
      </div>
    </section>
  );
}
