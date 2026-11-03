import Link from "next/link";
import { ArrowRight, PackageCheck, Truck } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { formatAud, type ResolvedPackage } from "@/constants/packages";

interface CartridgePackageCardProps {
  pkg: ResolvedPackage;
  /** System size label the package is limited to, if any. */
  sizeLabel?: string;
}

export function CartridgePackageCard({ pkg, sizeLabel }: CartridgePackageCardProps) {
  const saving = pkg.regularSubtotal - pkg.subtotal;
  const showSaving = saving >= 0.01;
  const cartridgeCount = pkg.lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-primary/40 bg-primary/5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
              <PackageCheck className="size-3.5" />
              Whole Set
            </span>
            {sizeLabel && (
              <span className="inline-flex items-center rounded-full border border-border/60 px-3 py-1 text-[10px] font-semibold text-muted-foreground">
                {sizeLabel}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-foreground">{pkg.name}</h3>
          <p className="text-xs text-muted-foreground">
            All {cartridgeCount} replacement cartridge{cartridgeCount === 1 ? "" : "s"} in one order.
          </p>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {pkg.lines.map((line) => (
            <li key={line.key} className="flex items-center gap-3 min-w-0">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted/40">
                <SmartImage
                  src={line.image}
                  alt={line.name}
                  useNextImage
                  fill
                  sizes="40px"
                  containerClassName="h-full w-full"
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-medium text-foreground line-clamp-2">
                {line.quantity > 1 && <span className="font-black text-primary">{line.quantity} × </span>}
                {line.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-t border-primary/20 pt-4 lg:w-60 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <div className="space-y-0.5">
          {showSaving && (
            <p className="text-xs text-muted-foreground">
              <span className="line-through">{formatAud(pkg.regularSubtotal)}</span>
              <span className="ml-2 font-bold text-emerald-600 dark:text-emerald-400">
                Save {formatAud(saving)}
              </span>
            </p>
          )}
          <p className="text-2xl font-black">
            <span className="bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent">
              {formatAud(pkg.subtotal)}
            </span>
            <span className="ml-1 text-xs font-semibold text-muted-foreground">+ GST</span>
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Truck className="size-3.5" />
            {pkg.delivery > 0 ? `+ ${formatAud(pkg.delivery)} delivery` : "Free delivery"}
          </p>
        </div>
        <Link
          href={`/checkout?package=${encodeURIComponent(pkg.id)}`}
          className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-black text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:bg-primary/95"
        >
          Buy Whole Set
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
