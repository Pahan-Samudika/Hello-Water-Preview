import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight, PackageCheck, Plus, ShieldCheck, Truck } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { formatAud, type ResolvedPackage } from "@/constants/packages";

interface CartridgePackageCardProps {
  pkg: ResolvedPackage;
  /** System size label the package is limited to, if any. */
  sizeLabel?: string;
}

const PRICE_GRADIENT =
  "bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent";

export function CartridgePackageCard({ pkg, sizeLabel }: CartridgePackageCardProps) {
  const saving = pkg.regularSubtotal - pkg.subtotal;
  const showSaving = saving >= 0.01;
  const cartridgeCount = pkg.lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <article className="group/set relative overflow-hidden rounded-[2rem] border border-primary/25 bg-linear-to-br from-primary/10 via-card/40 to-card/10 shadow-xl shadow-primary/5">
      {/* Soft glow accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative grid lg:grid-cols-[1fr_19rem]">
        {/* Left: what's in the set */}
        <div className="space-y-6 p-6 sm:p-8">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                <PackageCheck className="size-3.5" />
                Whole Set
              </span>
              {sizeLabel && (
                <span className="inline-flex items-center rounded-full border border-border/60 bg-background/40 px-3 py-1 text-[10px] font-semibold text-muted-foreground">
                  {sizeLabel}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{pkg.name}</h3>
            <p className="text-sm text-muted-foreground">
              {cartridgeCount} replacement cartridge{cartridgeCount === 1 ? "" : "s"}, delivered together in one order.
            </p>
          </div>

          {/* Cartridge tiles joined by "+" to read as one bundle */}
          <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-3">
            {pkg.lines.map((line, index) => (
              <Fragment key={line.key}>
                {index > 0 && (
                  <li aria-hidden className="hidden items-center sm:flex">
                    <span className="flex size-6 items-center justify-center rounded-full border border-primary/25 bg-background/60 text-primary">
                      <Plus className="size-3" />
                    </span>
                  </li>
                )}
                <li className="relative flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-background/40 p-2.5 transition-colors group-hover/set:border-primary/30 sm:w-32 sm:flex-col sm:items-stretch sm:gap-2">
                  <span className="absolute left-2 top-2 z-10 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground shadow">
                    {index + 1}
                  </span>
                  {line.quantity > 1 && (
                    <span className="absolute right-2 top-2 z-10 rounded-full bg-background/90 px-1.5 py-0.5 text-[10px] font-black text-primary shadow">
                      ×{line.quantity}
                    </span>
                  )}
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted/40 sm:aspect-square sm:size-auto sm:w-full">
                    <SmartImage
                      src={line.image}
                      alt={line.name}
                      useNextImage
                      fill
                      sizes="128px"
                      containerClassName="h-full w-full"
                      className="object-cover"
                    />
                  </div>
                  <p className="min-w-0 flex-1 text-xs font-semibold leading-snug text-foreground sm:line-clamp-2 sm:flex-none sm:text-[11px]" title={line.name}>
                    {line.name}
                  </p>
                </li>
              </Fragment>
            ))}
          </ul>
        </div>

        {/* Right: price + action */}
        <div className="flex flex-col justify-center gap-5 border-t border-primary/15 bg-background/40 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Best price
              </span>
              {showSaving && (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Save {formatAud(saving)}
                </span>
              )}
            </div>
            <p className="flex items-baseline gap-1.5">
              <span className={`text-4xl font-black tracking-tight ${PRICE_GRADIENT}`}>
                {formatAud(pkg.subtotal)}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">+ GST</span>
            </p>
            {showSaving && (
              <p className="text-xs text-muted-foreground">
                Usually <span className="line-through">{formatAud(pkg.regularSubtotal)}</span>
              </p>
            )}
          </div>

          <dl className="space-y-1.5 border-y border-border/40 py-3 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <dt className="flex items-center gap-1.5">
                <Truck className="size-3.5" />
                Delivery
              </dt>
              <dd className="font-semibold text-foreground">
                {pkg.delivery > 0 ? formatAud(pkg.delivery) : "Free"}
              </dd>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <dt>Total incl. GST &amp; delivery</dt>
              <dd className="font-bold text-foreground">{formatAud(pkg.total)}</dd>
            </div>
          </dl>

          <div className="space-y-2.5">
            <Link
              href={`/checkout?package=${encodeURIComponent(pkg.id)}`}
              className="group/cta inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/95 hover:shadow-primary/30"
            >
              Buy Whole Set
              <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
            </Link>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              Secure checkout with PayPal
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
