const products = [
  {
    name: "Water Purifier Pro",
    description: "Advanced multi-stage filtration for homes and offices.",
    price: "$299",
  },
  {
    name: "Smart Bottle",
    description: "Track hydration and water quality from your phone.",
    price: "$49",
  },
  {
    name: "Refill Station Kit",
    description: "Modular refill station for schools and workplaces.",
    price: "$899",
  },
];

export default function ProductsPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Products</h1>
        <p className="text-muted-foreground">
          Explore our public catalog of water solutions designed for reliability and daily use.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.name} className="rounded-lg border p-5">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
            <p className="mt-4 text-sm font-medium">{product.price}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
