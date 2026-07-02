import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, ExternalLink } from "lucide-react";
import { getBlogs, getBlogBySlug } from "@/lib/db-queries";
import { createMetadata } from "@/lib/seo";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbsJsonLd, webPageJsonLd } from "@/lib/structured-data";
import { RelatedArticlesCarousel } from "@/components/custom/related-articles-carousel";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return {};

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blogs/${slug}`,
    image: post.coverImage,
    type: "article",
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  // Find other posts for the "Read More" section at the bottom
  const allBlogs = await getBlogs();
  const otherPosts = allBlogs.filter((p) => p.slug !== slug).slice(0, 6);

  return (
    <main className="relative w-full min-h-screen">
      <JsonLd
        data={[
          breadcrumbsJsonLd([
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs" },
            { name: post.title, path: `/blogs/${post.slug}` },
          ]),
          webPageJsonLd({
            name: post.title,
            description: post.excerpt,
            path: `/blogs/${post.slug}`,
          }),
        ]}
      />

      <article className="mx-auto w-full max-w-6xl px-6 py-8 md:py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Back Link */}
        <MotionWrapper
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-4"
        >
          <Link
            href="/blogs"
            className="inline-flex w-fit items-center gap-2 rounded-full border bg-background px-5 py-2.5 text-sm font-medium text-muted-foreground shadow-sm transition-all hover:bg-primary/5 hover:text-primary hover:border-primary/20"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Blogs</span>
          </Link>
        </MotionWrapper>

        {/* Blog Header */}
        <header className="mb-10 space-y-6">

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="text-xl text-muted-foreground font-medium text-balance">
              {post.subtitle}
            </p>
          )}

          {/* Metadata & Author details */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={44}
                height={44}
                className="rounded-full bg-muted border border-border"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl md:rounded-3xl border border-border mb-12 shadow-md">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground/90 leading-relaxed text-base md:text-lg">
          {post.content.map((block, index) => {
            switch (block.type) {
              case "heading":
                return (
                  <h2
                    key={index}
                    className="text-2xl font-bold text-foreground tracking-tight mt-10 mb-4 pt-4 border-t border-border/40 first:border-0"
                  >
                    {block.text}
                  </h2>
                );
              case "quote":
                return (
                  <blockquote
                    key={index}
                    className="my-8 rounded-2xl border-l-4 border-primary bg-primary/5 p-6 md:p-8 italic text-foreground font-medium text-lg leading-relaxed shadow-xs"
                  >
                    "{block.text}"
                  </blockquote>
                );
              case "list":
                return (
                  <ul key={index} className="list-disc pl-6 space-y-2 my-4 text-muted-foreground">
                    {block.items?.map((item, itemIdx) => (
                      <li key={itemIdx} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              case "text":
              default:
                return (
                  <p key={index} className="text-muted-foreground text-justify sm:text-left">
                    {block.text}
                  </p>
                );
            }
          })}
        </div>

        {/* Sources Section */}
        {post.sources && post.sources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Sources & References
            </h3>
            <ul className="flex flex-col gap-3">
              {post.sources.map((source, index) => (
                <li key={index} className="flex items-start">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-muted-foreground/80 hover:text-primary transition-colors group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0 mt-1.5" />
                    <span className="text-left leading-tight">{source.name}</span>
                    <ExternalLink className="size-3 shrink-0 mt-1 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dynamic Footer for reading other blogs */}
        <RelatedArticlesCarousel posts={otherPosts} />
        </div>
      </article>
    </main>
  );
}
