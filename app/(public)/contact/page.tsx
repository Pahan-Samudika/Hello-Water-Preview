import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContactCard } from "@/components/custom/contact-card";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <ContactCard
          className="overflow-hidden rounded-2xl border-border/60 bg-background/60 backdrop-blur-sm"
          formSectionClassName="bg-card/60 dark:bg-card/30"
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
          title="Get in touch"
        >
          <form action="" className="w-full space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input type="text" placeholder="Your full name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Phone</Label>
              <Input type="phone" placeholder="04xx xxx xxx" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Message</Label>
              <Textarea placeholder="Tell us what you need help with..." />
            </div>
            <Button className="w-full rounded-full" type="button">
              Submit
            </Button>
          </form>
        </ContactCard>
      </div>
    </section>
  );
}
