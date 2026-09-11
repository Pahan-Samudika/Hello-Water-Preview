import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { paymentOptions } from "@/constants/financing";

export function FinancingOptionsPreview() {
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-muted/20 p-4 sm:p-5 flex flex-col gap-4 shadow-sm hover:border-primary/20 transition-colors">
      <div className="flex flex-row items-start sm:items-center justify-between gap-4">
        <h4 className="text-sm sm:text-base font-semibold tracking-wide text-foreground leading-tight">
          Flexible Financing Available
        </h4>
        <Link 
          href="/financing" 
          className="shrink-0 whitespace-nowrap text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group mt-0.5 sm:mt-0"
        >
          Learn More <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {paymentOptions.map((option) => (
            <div 
              key={option.id} 
              className="bg-white rounded-lg px-3 py-1.5 shadow-sm flex items-center justify-center border border-transparent"
            >
              <Image
                src={option.logoSrc}
                alt={option.logoAlt}
                width={70}
                height={24}
                className="h-4 sm:h-5 w-auto object-contain"
              />
            </div>
          ))}
        </div>
        <span className="text-xs font-medium text-muted-foreground/80 sm:ml-2">
          Up to 36 months interest-free*
        </span>
      </div>
    </div>
  );
}
