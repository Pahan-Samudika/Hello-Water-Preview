import watermarkLogo from "@/assets/logos/certifications/watermark.png";
import awqcLogo from "@/assets/logos/certifications/awqc.png";
import sensitiveChoiceLogo from "@/assets/logos/certifications/sensitive-choice.png";
import nsfLogo from "@/assets/logos/certifications/nsf.png";
import { StaticImageData } from "next/image";

export interface Certification {
  title: string;
  description: string;
  logo: StaticImageData;
  heroLogoSize: string;
  subtitle: string;
}

export const certifications: Certification[] = [
  {
    title: "WaterMark Certification",
    description: "This system is approved under Australia’s official WaterMark scheme, confirming it meets rigorous plumbing & safety regulations. Designed for compliant installation by licensed professionals, it delivers reliable performance you can trust in your home every day.",
    logo: watermarkLogo,
    subtitle: "Watermark Std. WMTS 103 PENTAIR Australia",
    heroLogoSize: "max-h-12",
  },
  {
    title: "AS/NZS 4020 Tested (AWQC)",
    description: "Certified by the Australian Water Quality Centre (AWQC), a leading Australian laboratory & research facility specializing in water testing, analysis & certification to ensure safety & compliance with national drinking water standards. This certification confirms all materials in contact with your water are non-toxic & won’t leach harmful substances, protecting the taste, colour & overall quality of your water; so what flows through your home stays clean, pure & uncompromised.",
    logo: awqcLogo,
    subtitle: "Tested and Certified by NSF International to NSF/ANSI Standard 42 for material safety and structural integrity requirements",
    heroLogoSize: "max-h-10",
  },
  {
    title: "Sensitive Choice Program",
    description: "Approved by the National Asthma Council Australia, a national health organization that assesses products for asthma & allergy sensitivity, endorsing those better suited to improving indoor environmental quality. This certification highlights products designed to support a healthier indoor environment & indicates the system may help reduce potential irritants, making it a smart choice for households focused on asthma & allergy-friendly living.",
    logo: sensitiveChoiceLogo,
    subtitle: "The National Asthma Council Autralia",
    heroLogoSize: "max-h-12",
  },
  {
    title: "NSF/ANSI 42, 53 & 401 Certifications",
    description: "Certified by NSF International, an independent global public health & safety organization that develops & certifies standards for water filtration & treatment systems to ensure contaminant reduction & material safety. This system is proven to reduce chlorine, taste & odour (NSF 42), remove a wide range of harmful contaminants including heavy metals & chemicals (NSF 53), & target emerging pollutants such as pharmaceuticals & modern trace compounds (NSF 401). Together, these certifications deliver advanced multi-stage protection; giving you cleaner, safer & better-quality water in every part of your home.",
    logo: nsfLogo,
    subtitle: "Tested for suitability of products for use in contact with drinking water with regard to their effect on the quality of water",
    heroLogoSize: "max-h-14",
  }
];
