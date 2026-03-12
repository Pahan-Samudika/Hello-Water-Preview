"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import { ArrowRightIcon } from "lucide-react";

import Autoplay from "embla-carousel-autoplay";

import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type MenuData = {
  id: number;
  img: string;
  imgAlt: string;
  userAvatar: string;
  userComment: string;
};

const HeroSection = ({ menudata }: { menudata: MenuData[] }) => {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [commentsApi, setCommentsApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!mainApi) {
      return;
    }

    setCurrent(mainApi.selectedScrollSnap());
    mainApi.on("select", () => {
      const selectedIndex = mainApi.selectedScrollSnap();

      setCurrent(selectedIndex);

      // Sync all carousels with main carousel
      thumbApi?.scrollTo(selectedIndex);
      commentsApi?.scrollTo(selectedIndex);
    });
  }, [mainApi, thumbApi, commentsApi]);

  useEffect(() => {
    if (!thumbApi) {
      return;
    }

    thumbApi.on("select", () => {
      const selectedIndex = thumbApi.selectedScrollSnap();

      setCurrent(selectedIndex);

      // Sync main and comments carousel with thumbnail carousel
      mainApi?.scrollTo(selectedIndex);
      commentsApi?.scrollTo(selectedIndex);
    });
  }, [thumbApi, mainApi, commentsApi]);

  useEffect(() => {
    if (!commentsApi) {
      return;
    }

    commentsApi.on("select", () => {
      const selectedIndex = commentsApi.selectedScrollSnap();

      setCurrent(selectedIndex);

      // Sync main and thumbnail carousel with comments carousel
      mainApi?.scrollTo(selectedIndex);
      thumbApi?.scrollTo(selectedIndex);
    });
  }, [commentsApi, mainApi, thumbApi]);

  const handleThumbClick = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index);
    },
    [mainApi],
  );

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <section className="flex-1 px-6 py-12 sm:py-12">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="grid grid-cols-1 items-center gap-6 gap-y-12 md:gap-y-16 lg:grid-cols-5">
          <div className="flex w-full flex-col justify-center gap-5 max-lg:items-center lg:col-span-3">
            <h1 className="text-3xl leading-[1.29167] font-semibold text-balance max-lg:text-center sm:text-4xl lg:text-5xl">
              Every Drop Matters!
            </h1>

            <p className="text-muted-foreground sm:max-w-xl text-sm sm:text-xl max-lg:text-center">
              Upgrade your home with Hello Water. Enjoy peace of mind with
              whole-house filtration that delivers safe, crystal-clean water to
              your family every single day.
            </p>

            <div className="flex items-center gap-4">
              <Button
                size="lg"
                className="group relative w-fit overflow-hidden rounded-full text-base before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] has-[>svg]:px-6 dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]"
                render={<a href="#" />}
                nativeButton={false}
              >
                Explore Our Products
                <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </div>

            <Carousel
              className="flex w-full items-center justify-center lg:col-span-2 hidden sm:flex"
              setApi={setCommentsApi}
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {menudata.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="flex items-center h-full min-h-14 justify-start gap-4 mt-8 lg:items-center"
                  >
                    <img
                      src={item.userAvatar}
                      alt={item.imgAlt}
                      className="border-background size-10 rounded-full border-4"
                    />
                    <div className="bg-primary hidden !h-6 !w-1 !rounded-full sm:block" />
                    <p className="text-card-foreground">{item.userComment}</p>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <Carousel
            className="w-full overflow-hidden rounded-2xl lg:col-span-2"
            setApi={setMainApi}
            plugins={[plugin.current]}
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {menudata.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="flex w-full items-center justify-center"
                >
                  <img
                    src={item.img}
                    alt={item.imgAlt}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
