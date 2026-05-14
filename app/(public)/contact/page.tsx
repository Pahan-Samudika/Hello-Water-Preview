import { ContactCard } from "@/components/custom/contact-card";
import { ContactForm } from "@/components/custom/contact-form";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";

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
                value: "support@hellowaterfiltration.com.au",
              },
              {
                icon: <PhoneIcon />,
                label: "Phone",
                value: "1300 515 469",
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
