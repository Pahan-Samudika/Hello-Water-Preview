import type { ComponentType } from "react";
import { aboutHighlights } from "@/constants";
import { CircleCheck } from "lucide-react";

type StatItem = {
  icon: ComponentType;
  value: string;
  description: string;
}[];

const AboutUs = ({ stats }: { stats: StatItem }) => {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {aboutHighlights.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-secondary bg-background p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <CircleCheck className="size-6" />
              <h2 className="text-2xl font-semibold">{item.title}</h2>
            </div>
            <p className="max-w-sm text-muted-foreground">{item.description}</p>
          </article>
        ))}
      </div>

        {/* Video player and stats */}
        <div className="relative py-8 h-full w-full max-lg:space-y-6 sm:mb-16 lg:mb-24">
          <img
            src="https://res.cloudinary.com/dnlb02zp9/image/upload/v1771561659/nd1np6qyyfcetzpo0efv_yrbnyh.webp"
            alt="About us illustration"
            className="max-h-[500px] w-full rounded-lg object-cover"
          />

          {/* Stats card overlapping the video section */}
          <div className="bg-background grid gap-10 rounded-3xl border border-secondary p-6 sm:p-8 sm:max-lg:grid-cols-2 lg:absolute lg:-bottom-25 lg:left-1/2 lg:w-3/4 lg:-translate-x-1/2 lg:grid-cols-4 lg:px-10 xl:w-max">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-2.5 text-center"
              >
                <div className="flex size-7 items-center justify-center [&>svg]:size-7">
                  <stat.icon />
                </div>
                <span className="text-2xl font-semibold">{stat.value}</span>
                <p className="text-muted-foreground text-lg">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
