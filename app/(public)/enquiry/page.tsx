import type { Metadata } from "next";
import { MailIcon, PhoneIcon, MapPinIcon, QrCodeIcon } from "lucide-react";
import { ContactCard } from "@/components/custom/contact-card";
import { EnquiryForm } from "@/components/custom/enquiry-form";

export const metadata: Metadata = {
  title: "QR Enquiry | Hello Water Filtration",
  description: "Request a water filtration installation by submitting your details via our QR enquiry system.",
};

export default function EnquiryPage() {
  return (
    <main className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-6 py-8 md:py-16 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <ContactCard
            contactInfo={[
              {
                icon: <MailIcon className="w-5 h-5" />,
                label: "Support",
                value: "support@hellowaterfiltration.com.au",
              },
              {
                icon: <PhoneIcon className="w-5 h-5" />,
                label: "Call Us",
                value: "1300 515 469",
                className: "col-span-1 md:col-span-2 lg:col-span-1",
              },
            ]}
            description="Found us via a QR code or need a free water assessment? Submit your details below and our filtration experts will contact you shortly."
            title="Request Installation"
          >
            <EnquiryForm />
          </ContactCard>
        </div>
      </section>
      
      {/* Decorative background elements consistent with the site's design */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
    </main>
  );
}
