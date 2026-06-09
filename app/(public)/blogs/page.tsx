import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { blogs } from "@/constants/blogs";
import { MotionWrapper } from "@/components/custom/motion-wrapper";

export default function BlogsPage() {
  return (
    <main className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
        <MotionWrapper 
          className="mb-12 space-y-4"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              Water Quality & Health Blogs
            </h1>
          </MotionWrapper>
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            <p className="text-muted-foreground sm:text-lg">
              Insights, news, and expert guides from Hello Water Filtration to help you stay informed about what's in your water and how to protect your household.
            </p>
          </MotionWrapper>
        </MotionWrapper>

        {/* Blogs Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
          {blogs.map((post, idx) => (
            <MotionWrapper
              key={post.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: idx * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Cover Image Link */}
              <Link href={`/blogs/${post.slug}`} className="relative block aspect-video overflow-hidden bg-muted">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={idx < 2}
                />
              </Link>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6 md:p-8">
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {post.publishedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl line-clamp-2 mb-3 hover:text-primary transition-colors">
                  <Link href={`/blogs/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </section>
    </main>
  );
}
