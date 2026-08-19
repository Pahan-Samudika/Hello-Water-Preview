"use client";

import { ContactCard } from "@/components/custom/contact-card";
import { ContactForm } from "@/components/custom/contact-form";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { WhatsappIcon } from "@/assets/svg/whatsapp-icon";

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-6 py-8 md:py-16 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <ContactCard
            contactInfo={[
              {
                icon: <MailIcon />,
                label: "Email",
                value: <a href="mailto:sales@hellowater.com.au" className="hover:text-foreground hover:underline transition-colors">sales@hellowater.com.au</a>,
              },
              {
                icon: <PhoneIcon />,
                label: "Phone",
                value: <a href="tel:1300515469" className="hover:text-foreground hover:underline transition-colors">1300 515 469</a>,
              },
              {
                icon: <WhatsappIcon />,
                label: "WhatsApp",
                value: <a href="https://wa.me/61459803881" target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:underline transition-colors">+61 459 803 881</a>,
              },
              {
                icon: <MapPinIcon />,
                label: "Address",
                value: "103/55 Victor Crs, Narre Warren, Victoria 3805",
                className: "col-span-2",
              },
            ]}
            description="Have a question about filters, installation, or support? Send us a message & our team will get back to you within one business day."
            title="Get in Touch"
          >
            <ContactForm />
          </ContactCard>
        </div>
      </section>
    </main>
  );
}
