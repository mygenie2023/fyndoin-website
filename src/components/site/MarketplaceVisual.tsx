import workersImage from "@/assets/fyndo-workers.jpg";

const CARDS = [
  { trade: "Electrician", rating: "4.8", distance: "2.4 km away", top: "6%", left: "4%", delay: "0s" },
  { trade: "Tractor Rental", rating: "4.7", distance: "4.1 km away", top: "44%", left: "56%", delay: "1.4s" },
  { trade: "Carpenter", rating: "4.9", distance: "1.8 km away", top: "76%", left: "8%", delay: "2.6s" },
];

/**
 * Hero visual: a local map surface with nearby operator cards over an
 * authentic photo grid. Illustrative UI only — not real listings.
 */
export function MarketplaceVisual() {
  return (
    <div className="relative">
      <div className="surface-card relative overflow-hidden p-2 sm:p-3">
        <div className="relative overflow-hidden rounded-[1.1rem]">
          <img
            src={workersImage}
            alt="Mason, carpenter, electrician, tractor owner, tailor and bike mechanic at work"
            width={1280}
            height={960}
            fetchPriority="high"
            decoding="async"
            className="h-[22rem] w-full object-cover sm:h-[26rem] lg:h-[30rem]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,color-mix(in_oklab,var(--primary-deep)_78%,transparent))]"
          />

          {/* location pings */}
          <div aria-hidden="true" className="absolute inset-0">
            {CARDS.map((c) => (
              <span
                key={c.trade}
                className="absolute size-3 rounded-full bg-accent"
                style={{ top: c.top, left: `calc(${c.left} + 12%)`, animationDelay: c.delay }}
              >
                <span className="pin-pulse absolute inset-0 rounded-full bg-accent" />
              </span>
            ))}
          </div>

          <p className="absolute right-3 bottom-3 rounded-full bg-background/85 px-3 py-1 text-[0.68rem] font-medium text-muted-foreground backdrop-blur">
            Illustrative interface — not live listings
          </p>
        </div>
      </div>

      {/* floating operator cards */}
      <ul className="pointer-events-none absolute inset-0 hidden sm:block">
        {CARDS.map((c, i) => (
          <li
            key={c.trade}
            className="float-slow surface-card absolute w-[11.5rem] p-3"
            style={{ top: c.top, left: c.left, animationDelay: `${i * 1.3}s` }}
          >
            <p className="font-display text-sm font-bold">{c.trade}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-accent" aria-hidden="true">
                ★
              </span>
              {c.rating} · {c.distance}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold text-primary">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              Available nearby
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
