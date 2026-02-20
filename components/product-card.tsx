import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProductCardProps = {
  name: string;
  description: string;
  price: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
};

export function ProductCard({
  name,
  description,
  price,
  image,
  imageAlt,
  featured = false,
}: ProductCardProps) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={image}
        alt={imageAlt}
        className="relative z-20 aspect-video w-full object-cover"
      />
      <CardHeader>
        <CardAction>
          <Badge variant={featured ? "secondary" : "outline"}>
            {featured ? "Featured" : price}
          </Badge>
        </CardAction>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="gap-3">
        <Button className="w-full">View Product</Button>
      </CardFooter>
    </Card>
  );
}


