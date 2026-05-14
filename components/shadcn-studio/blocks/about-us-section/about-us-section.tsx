import type { ComponentType } from "react";
import { aboutHighlights } from "@/constants";
import { Target, Users, ShieldCheck } from "lucide-react";

type StatItem = {
  icon: ComponentType;
  value: string;
  description: string;
}[];

const getIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("mission")) return Target;
  if (t.includes("team")) return Users;
  return ShieldCheck;
};

const AboutUs = ({ stats }: { stats: StatItem }) => {
  return (
    <section className="bg-background">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aboutHighlights.map((item) => {
          const Icon = getIcon(item.title);
          return (
            <div
              key={item.title}
            >
              <article className="group relative h-full overflow-hidden rounded-2xl border border-secondary bg-background/50 p-8 transition-all hover:bg-secondary/10 hover:shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon className="size-6" />
                  </div> </div>
                <h2 className="mb-4 text-2xl font-bold tracking-tight">{item.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </article>
            </div>
          );
        })}
      </div>

      {/* Video/Image & Stats Section */}
      <div className="relative mt-20">
        {/* Main Visual Container */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://res.cloudinary.com/dnlb02zp9/image/upload/v1771561659/nd1np6qyyfcetzpo0efv_yrbnyh.webp"
            className="aspect-video w-full object-cover sm:max-h-[600px]"
          >
            <source 
              src="https://res.cloudinary.com/dnlb02zp9/video/upload/f_auto,q_auto/v1775988476/hellowater_gzuvvy.mp4" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
          {/* Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
        </div>

        {/* Stats Bar - Refined Crystal Panel */}
        <div className="mx-auto w-[calc(100%-2rem)] max-w-6xl relative z-10 mt-[-4rem] lg:mt-[-6rem]">
          <div className="bg-background/60 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-[3rem] p-10 lg:p-14 overflow-hidden group">
            {/* Subtle decorative elements */}
            <div className="absolute -top-24 -right-24 size-64 bg-primary/5 blur-3xl rounded-full" />
            <div className="absolute -bottom-24 -left-24 size-64 bg-secondary/5 blur-3xl rounded-full" />

            <div className="relative grid grid-cols-2 gap-y-12 gap-x-8 lg:grid-cols-4 lg:gap-x-0">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center text-center space-y-5 lg:px-8 ${
                    index !== stats.length - 1 ? "lg:border-r lg:border-border/40" : ""
                  }`}
                >
                  <div className="flex size-16 items-center justify-center rounded-[1.25rem] bg-primary text-primary-foreground shadow-xl shadow-primary/20 ring-8 ring-primary/5 transition-transform duration-500 group-hover:scale-105">
                    <stat.icon/>
                  </div>
                  
                  <div className="flex flex-col gap-1 sm:gap-4">
                    <span className="text-4xl font-bold tracking-tighter bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent sm:text-5xl lg:text-6xl">
                      {stat.value}
                    </span>
                    <p className="text-xs font-bold text-muted-foreground max-w-[160px] leading-tight sm:text-sm">
                      {stat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
