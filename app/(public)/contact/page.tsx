import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContactCard } from "@/components/custom/contact-card";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-6 py-8 md:py-16 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <ContactCard
            contactInfo={[
              {
                icon: <MailIcon />,
                label: "Email",
                value: "support@hellowater.example",
              },
              {
                icon: <PhoneIcon />,
                label: "Phone",
                value: "0498 588 725",
              },
              {
                icon: <MapPinIcon />,
                label: "Address",
                value: "103/55 Victor Crs, Narre Warren, Victoria 3805",
                className: "col-span-2",
              },
            ]}
            description="Have a question about filters, installation, or support? Send us a message and our team will get back to you within one business day."
            title="Get in Touch"
          >
            <form action="" className="w-full space-y-5 lg:space-y-6">
              <div className="flex flex-col gap-2">
                <Label className="pl-1 text-sm font-medium text-foreground/80">Name</Label>
                <Input type="text" placeholder="Your full name" className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="pl-1 text-sm font-medium text-foreground/80">Email</Label>
                <Input type="email" placeholder="you@example.com" className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="pl-1 text-sm font-medium text-foreground/80">Phone</Label>
                <Input type="phone" placeholder="04xx xxx xxx" className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="pl-1 text-sm font-medium text-foreground/80">Message</Label>
                <Textarea placeholder="Tell us what you need help with..." className="min-h-[120px] rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50 resize-y pt-3" />
              </div>
              <Button type="button" className="group relative mt-2 w-full overflow-hidden rounded-full py-6 text-base font-semibold shadow-lg hover:shadow-primary/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]">
                Send Message
              </Button>
            </form>
          </ContactCard>
        </div>
      </section>
    </div>
  );
}
