import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Hello Water Filtration",
  description: "Our commitment to protecting your personal information and privacy at Hello Water Filtration.",
};

interface Section {
  title: string;
  items: (string | string[] | { type: "address"; details: string[] })[];
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 2026";

  const sections: Section[] = [
    {
      title: "1. Information We Collect",
      items: [
        "We collect personal information necessary to provide water filtration services and products. This may include:",
        [
          "Contact Details: Name, residential or business address, email address, and phone number.",
          "Service Information: Details regarding your water system requirements, installation history, and maintenance schedules.",
          "Payment Information: Credit card or banking details used for transactions (processed securely).",
          "Digital Data: IP addresses, cookies, and website usage data via Hellowaterfiltration.com.au.",
        ],
      ],
    },
    {
      title: "2. How We Collect Information",
      items: [
        "Collection occurs through various interactions, including:",
        [
          "Online inquiry forms and quote requests.",
          "Phone consultations and service bookings.",
          "On-site installations and maintenance visits.",
          "Direct correspondence via email or mail.",
        ],
      ],
    },
    {
      title: "3. Use of Personal Information",
      items: [
        "Your information is used to:",
        [
          "Provide, install, and maintain water filtration systems.",
          "Process orders, invoices, and payments.",
          "Communicate technical updates or service reminders.",
          "Improve our website and customer service experience.",
          "Comply with legal and regulatory obligations.",
        ],
      ],
    },
    {
      title: "4. Disclosure of Information",
      items: [
        "We do not sell your personal information. We may disclose data to third parties only as required to facilitate our services, such as:",
        [
          "Contracted licensed plumbers or technicians performing installations.",
          "Freight and delivery providers.",
          "Professional advisors (accountants or legal counsel) where necessary.",
          "Regulatory bodies if required by Australian law.",
        ],
      ],
    },
    {
      title: "5. Data Security",
      items: [
        "Hellowater Filtration Ltd takes reasonable steps to protect your information from unauthorized access, modification, or disclosure. We utilize secure servers and encryption for digital transactions. Physical records are stored in secure locations at our office in Narre Warren.",
      ],
    },
    {
      title: "6. Access and Corrections",
      items: [
        "You have the right to access the personal information we hold about you. If any details are incorrect or out of date, please contact us to request an update.",
      ],
    },
    {
      title: "7. Cookies and Analytics",
      items: [
        "Our website uses cookies to enhance user experience. You can choose to disable cookies in your browser settings, though this may affect some website functionality.",
      ],
    },
    {
      title: "8. Contact Us",
      items: [
        "For questions regarding this policy or to exercise your privacy rights, please contact our Privacy Officer:",
        {
          type: "address",
          details: [
            "Hello Water Filtration Ltd",
            "103/55 Victor Crescent",
            "Narre Warren, VIC 3805",
            "Phone: 1300 515 469",
            "Email: sales@hellowater.com.au",
          ],
        },
      ],
    },
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } 
    },
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
      <MotionWrapper
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
      >
        <MotionWrapper variants={fadeUpVariants} className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last Updated: {lastUpdated}
          </p>
        </MotionWrapper>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <MotionWrapper
              key={idx}
              variants={fadeUpVariants}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-foreground border-b border-border/50 pb-2">
                {section.title}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-justify">
                {section.items.map((item, itemIdx) => {
                  if (typeof item === "object" && !Array.isArray(item) && item.type === "address") {
                    return (
                      <div key={itemIdx} className="not-italic bg-muted/30 p-6 rounded-2xl border border-border/50 space-y-1">
                        <p className="font-bold text-foreground text-lg mb-2">{item.details[0]}</p>
                        <p>{item.details[1]}</p>
                        <p className="pb-2">{item.details[2]}</p>
                        <p><span className="font-semibold text-foreground">Phone:</span> {item.details[3].split(": ")[1]}</p>
                        <p><span className="font-semibold text-foreground">Email:</span> {item.details[4].split(": ")[1]}</p>
                      </div>
                    );
                  }
                  if (Array.isArray(item)) {
                    return (
                      <ul key={itemIdx} className="list-disc space-y-2 pl-6">
                        {item.map((li, liIdx) => (
                          <li key={liIdx} className="pl-2">
                            {li}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={itemIdx}>{item as string}</p>;
                })}
              </div>
            </MotionWrapper>
          ))}
        </div>

        <MotionWrapper variants={fadeUpVariants} className="mt-20 border-t pt-8 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Hello Water Filtration Ltd. All rights reserved.
          </p>
        </MotionWrapper>
      </MotionWrapper>
    </div>
  );
}
