import Link from "next/link";

const highlights = [
  {
    title: "Simple setup",
    description: "Get started quickly with a clean structure and reusable UI blocks.",
  },
  {
    title: "Built for scale",
    description: "Use composable sections and shared components as your product grows.",
  },
  {
    title: "Fast iteration",
    description: "Ship changes safely with predictable routing and layout boundaries.",
  },
];

export default function PublicHomePage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl flex-col justify-center gap-10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-medium text-muted-foreground">Public Section</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome to Hello Water
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          This is the public-facing home page with dedicated pages for products, about, and contact.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/products" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          View Products
        </Link>
        <Link href="/about" className="rounded-md border px-4 py-2 text-sm font-medium">
          Learn About Us
        </Link>
        <Link href="/contact" className="rounded-md border px-4 py-2 text-sm font-medium">
          Contact Team
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-lg border p-5">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
