export default function PublicLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted md:col-span-2" />
      </div>
    </div>
  );
}
