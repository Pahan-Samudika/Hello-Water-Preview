import { 
  Droplets, 
  Sparkles, 
  HeartPulse, 
  Wrench, 
  CheckCircle2, 
  Coins, 
  Zap, 
  Leaf,
  Waves,
  ShieldCheck,
  Coffee,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Timeline, TimelineData } from "@/components/custom/timeline";

const benefits = [
  {
    title: "Pristine Taste & Smell",
    description: "Say goodbye to unpleasant odours & chemical tastes. Filtered water is fresher, cleaner, & more enjoyable straight from every tap.",
    icon: Droplets,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Revitalizing Skin & Hair",
    description: "Gentler on your skin & hair by reducing chlorine & harsh chemicals. It helps prevent dryness, irritation, & damage for a healthier glow.",
    icon: Sparkles,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Enhanced Well-being",
    description: "Enjoy cleaner, safer water for drinking, cooking, & bathing. Our system reduces harmful contaminants, supporting overall family health.",
    icon: HeartPulse,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    title: "Appliance Protection",
    description: "Hard water & sediment can damage appliances. Filtration extends the life of washing machines, water heaters, & plumbing systems.",
    icon: Wrench,
    color: "text-slate-500",
    bg: "bg-slate-500/10"
  },
  {
    title: "A Spotless Home",
    description: "Reduce mineral buildup on sinks & tiles. Enjoy spotless dishes, brighter laundry, & significantly less time spent cleaning.",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Significant Cost Savings",
    description: "Eliminate the need for bottled water & reduce maintenance costs. A long-term investment that pays for itself over time.",
    icon: Coins,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10"
  },
  {
    title: "Seamless Convenience",
    description: "Consistent water quality at every tap. Whether it’s for drinking, showering, or cleaning, you get the best water effortlessly.",
    icon: Zap,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    title: "Eco-Friendly Living",
    description: "Reduce plastic waste by eliminating single-use bottles. A sustainable choice that’s better for your home & the environment.",
    icon: Leaf,
    color: "text-green-500",
    bg: "bg-green-500/10"
  }
];

const timelineData: TimelineData[] = [
  {
    timeframe: "Day 1-3",
    title: "Cleaner, fresher water taste & smell",
    description: "Sediment & chlorine taste/odor are immediately reduced; water is noticeably smoother.",
    icon: Droplets,
  },
  {
    timeframe: "Week 1",
    title: "No more chlorine or chemical aftertaste",
    description: "Chemicals like chlorine, chloramine & fluoride are filtered out, making water taste natural.",
    icon: Waves,
  },
  {
    timeframe: "Week 2–4",
    title: "Softer water on skin & hair",
    description: "Minerals & impurities that cause dryness or irritation start to be reduced, improving skin & hair feel.",
    icon: Sparkles,
  },
  {
    timeframe: "Month 1–3",
    title: "Reduced scale buildup",
    description: "Hard water minerals start being minimized, protecting appliances & reducing limescale in taps, kettles, & showers.",
    icon: ShieldCheck,
  },
  {
    timeframe: "Month 3–6",
    title: "Improved coffee, tea, & cooking results",
    description: "Purified water enhances the taste & aroma of beverages & food.",
    icon: Coffee,
  },
  {
    timeframe: "Month 6–12",
    title: "Noticeable health & hydration benefits",
    description: "Cleaner water encourages more daily consumption; fewer contaminants support overall wellness.",
    icon: HeartPulse,
  },
  {
    timeframe: "Year 1–2",
    title: "Long-term appliance protection",
    description: "Water quality stays consistently high; system pays for itself in avoided repairs & savings on bottled water.",
    icon: TrendingUp,
  },
];

export default function BenefitsPage() {
  return (
    <main className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
        <header className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
            Experience the Benefits
          </h1>
          <p className="text-muted-foreground sm:text-lg text-justify">
            Concerned about the quality of your tap water? Eliminate impurities, unpleasant odours, & harmful contaminants that impact both taste & safety.
          </p>
        </header>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="group h-full p-6 rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:bg-card dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div className={cn(
                "size-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110",
                benefit.bg,
                benefit.color
              )}>
                <benefit.icon className="size-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24 sm:px-6 lg:px-8 border-t border-border/40">
        <header className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            The Transformation Journey
          </h2>
          <p className="text-muted-foreground sm:text-lg max-w-3xl mx-auto">
            What you will notice after installation & how your water quality evolves over time.
          </p>
        </header>

        <Timeline items={timelineData} />
      </section>
    </main>
  );
}
