export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>
        <p className="text-muted-foreground">
          Reach out for product questions, support requests, or partnership opportunities.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border p-5">
          <h2 className="text-lg font-semibold">Email</h2>
          <p className="mt-2 text-sm text-muted-foreground">support@hellowater.example</p>
        </article>
        <article className="rounded-lg border p-5">
          <h2 className="text-lg font-semibold">Phone</h2>
          <p className="mt-2 text-sm text-muted-foreground">+1 (555) 123-4567</p>
        </article>
      </div>
    </section>
  );
}
