import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  name: string;
  description?: string;
  price: string;
  image: string;
  imageAlt: string;
  href?: string;
  className?: string;
};

export function ProductCard({
  name,
  description,
  price,
  image,
  imageAlt,
  href = "#",
  className,
}: ProductCardProps) {
  return (
    <Card
      className={cn(
        "group relative mx-auto w-full max-w-sm gap-0 overflow-hidden rounded-2xl border-0 p-0",
        className,
      )}
    >
      <img
        src={image}
        alt={imageAlt}
        className="block aspect-[4/5] w-full max-h-96 object-cover transition duration-300 ease-out group-hover:scale-105 group-hover:blur-[2px]"
      />

      <div className="pointer-events-none absolute right-3 bottom-3 z-20 rounded-full bg-black/65 px-3 py-1.5 text-2xl font-medium text-white backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-0">
        {price}
      </div>

      <div className="absolute inset-0 z-30 flex items-end bg-black/80 p-4 opacity-0 backdrop-blur-md grayscale transition duration-300 group-hover:opacity-100">
        <div className="w-full rounded-xl p-4 shadow-xl">
          <p className="line-clamp-6 text-3xl font-semibold text-white">
            {name}
          </p>
          {description ? (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/80">
              {description}
            </p>
          ) : null}

          <div className="mt-3 flex w-full flex-col gap-3">
            <span className="text-lg font-medium text-white/90 text-start">{price}</span>
            <Button
              size="sm"
              className="bg-white/95 text-black hover:bg-white w-full"
              render={<a href={href} />}
              nativeButton={false}
            >
              View Product
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
