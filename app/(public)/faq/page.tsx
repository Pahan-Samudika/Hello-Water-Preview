import { ChevronDown, HelpCircle, MessageCircle, PhoneCall, Wrench, Settings, CreditCard, ShieldCheck, Waves, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { faqPageJsonLd } from "@/lib/structured-data";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { getFAQs } from "@/lib/db-queries";

export const revalidate = 0;

const categoryIcons: Record<string, any> = {
  "Product & Benefits": Waves,
  "Installation": Wrench,
  "Maintenance & Service": Settings,
  "Cost & Warranty": CreditCard,
  "About Hello Water": ShieldCheck,
};

export default async function FAQPage() {
  const faqs = await getFAQs();

  // Group FAQs by category while preserving order
  const categoriesMap: Record<
    string,
    { title: string; icon: any; items: { question: string; answer: string }[] }
  > = {};

  for (const faq of faqs) {
    if (!categoriesMap[faq.category]) {
      categoriesMap[faq.category] = {
        title: faq.category,
        icon: categoryIcons[faq.category] || HelpCircle,
        items: [],
      };
    }
    categoriesMap[faq.category].items.push({
      question: faq.question,
      answer: faq.answer,
    });
  }

  const faqCategories = Object.values(categoriesMap);
  const faqJsonLd = faqPageJsonLd(faqCategories);

  return (
    <main className="relative overflow-hidden w-full min-h-screen">
      <JsonLd data={faqJsonLd} />
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
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              Frequently Asked Questions
            </h1>
          </MotionWrapper>
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            <p className="text-muted-foreground sm:text-lg">
              Everything you need to know about Hello Water Filtration. If you cannot find your answer here, reach out to our team.
            </p>
          </MotionWrapper>
        </MotionWrapper>

        <div className="space-y-16">
          {faqCategories.map((category, catIndex) => (
            <MotionWrapper
              key={category.title}
              id={category.title === "Product & Benefits" ? "benefits" : undefined}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="space-y-6"
            >
              <MotionWrapper
                className="flex items-center gap-4 pb-3 border-b border-border/50"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
                }}
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-white/40 backdrop-blur-sm">
                  <category.icon className="size-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">{category.title}</h2>
              </MotionWrapper>

              <div className="grid gap-4">
                {category.items.map((item, itemIndex) => {
                  const id = `${catIndex}-${itemIndex}`;

                  return (
                    <MotionWrapper
                      key={id}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.98 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
                        },
                      }}
                    >
                      <details
                        className="group rounded-3xl border border-white/35 bg-white/35 shadow-sm backdrop-blur-md transition-all duration-300 open:border-primary/40 open:bg-white/40 open:shadow-xl open:shadow-primary/5 dark:border-white/10 dark:bg-white/5 dark:open:border-primary/20 dark:open:bg-white/10"
                      >
                        <summary className="flex w-full cursor-pointer list-none items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                          <span className="pr-8 text-base font-semibold text-foreground transition-colors group-hover:text-primary/70 group-open:text-primary md:text-lg">
                            {item.question}
                          </span>
                          <span className="flex-shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors group-hover:text-primary/50 group-open:bg-primary/20 group-open:text-primary">
                            <ChevronDown className="size-5 transition-transform duration-300 group-open:rotate-180" />
                          </span>
                        </summary>

                        <div
                          id={`faq-answer-${id}`}
                          className="px-6 pb-6 leading-relaxed text-sm md:text-base"
                        >
                          <div className="h-px w-full bg-linear-to-r from-primary/30 via-transparent to-transparent mb-4" />
                          <p className="whitespace-pre-line">{item.answer}</p>
                        </div>
                      </details>
                    </MotionWrapper>
                  );
                })}
              </div>
            </MotionWrapper>
          ))}
        </div>

        {/* Contact CTA */}
        <MotionWrapper
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24 p-8 md:p-12 rounded-[2.5rem] border border-white/40 bg-white/20 backdrop-blur-2xl text-center relative overflow-hidden dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-6 shadow-inner ring-1 ring-white/50">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Cannot find the answer you are looking for?</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Our water specialists are here to provide expert advice tailored to your home&apos;s unique needs. Reach out to us directly for a personalized solution
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:1300515469"
              className="inline-flex w-full sm:w-auto h-14 items-center justify-center rounded-full bg-primary px-10 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
            >
              <PhoneCall className="w-5 h-5 mr-2" />
              1300 515 469
            </a>
            <Link
              href="/contact"
              className="group relative inline-flex w-full sm:w-auto h-14 items-center justify-center overflow-hidden rounded-full px-10 text-lg font-bold border border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Us
              <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </MotionWrapper>
      </section>
    </main>
  );
}
