export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About Us</h1>
        <p className="text-muted-foreground">
          Hello Water builds simple, practical water products focused on everyday reliability.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border p-5">
          <h2 className="text-lg font-semibold">Our Mission</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Improve access to clean water with products that are easy to use and maintain.
          </p>
        </article>
        <article className="rounded-lg border p-5">
          <h2 className="text-lg font-semibold">Our Approach</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Build clear workflows, clean interfaces, and dependable hardware backed by support.
          </p>
        </article>
      </div>
    </section>
  );
}
