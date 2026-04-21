export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: string;
  recent?: boolean;
  image: string;
  imageAlt: string;
  cardDescription: string;
  shortDescription: string;
  description: string[];
  features: string[];
};

export const products: Product[] = [
  {
    id: 1,
    slug: "whole-home-filtration-system",
    name: "Whole Home Filtration System",
    category: "Filtration Systems",
    price: "Call for Price",
    recent: true,
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1776745180/system_sp5eut.webp",
    imageAlt: "Whole Home Filtration System",
    cardDescription: "Whole Home Micron Water Filtration System",
    shortDescription: "A powerful point-of-entry filtration system using gradient density sediment filtration & Activated Carbon Fibre technology to protect every tap in your home.",
    description: [
      "The Hello Water Whole Home Filtration System delivers powerful point-of-entry filtration using advanced cartridge technology & a rugged, high-performance design. Built to protect every tap in your home, it combines gradient density sediment filtration with an Activated Carbon Fibre (ACF) cartridge to target both physical & chemical contaminants.",
      "DGD Series cartridges (0.5 micron nominal), made from 100% pure polypropylene, capture sand, silt, rust, clay & microplastics with high efficiency. Their gradient density design filters larger particles first, then finer contaminants deeper within the cartridge, maximising dirt-holding capacity, maintaining strong flow, & extending filter life.",
      "At its core is the EnnoPure ePureFlo ACF cartridge, engineered for advanced chemical filtration. It reduces chlorine taste & odour by 2x compared to regular cartridges, while also targeting PFAS, VOCs & other chemical contaminants. By combining sediment filtration & carbon block performance in one media, it delivers high adsorption without releasing carbon fines.",
      "Housed in a marine-grade stainless steel cabinet, the system is built for durability in harsh conditions. A patented ventilation system prevents heat build-up, while a built-in bypass line & pressure adjustment valve provide flexibility, control & consistent performance.",
      "With a peak flow rate of up to 119 litres per minute, it is ideal for larger homes & semi-commercial applications requiring high-volume, reliable water supply.",
    ],
    features: [
      "Advanced multi-stage whole home filtration",
      "Dual-gradient sediment filtration (0.5 micron nominal)",
      "Proprietary ACF (Activated Carbon Fibre) technology",
      "PFAS Certified GE Water Technology, VOC & chemical contaminant reduction",
      "Reduces fluoride, lead, manganese, other heavy metals & scale-forming minerals",
      "Bacteriostatic filter media",
      "Marine-grade stainless steel cabinet with 3 colour options",
      "SS316 bracket with polished mirror finish",
      "Patented ventilation system for heat & pressure management",
      "Built-in bypass line for flexible water access",
      "Integrated bronze pressure adjustment valve",
      "20\" high-capacity filter housings with double buna O-ring sealing",
      "NSF/ANSI 42, 53, 401 & WaterMark certified components",
      "Ideal for large residential & semi-commercial applications",
      "Up to 119L/min high-flow capacity",
    ],
  },
  {
    id: 2,
    slug: "the-bottle-water-plant-whole-house-micro-filtration",
    name: "The Whole House Bottle Water Plant",
    category: "Filtration Systems",
    price: "Call for Price",
    recent: false,
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774892292/IMG_5153_wftjgy.jpg",
    imageAlt: "The Whole House Bottle Water Plant",
    cardDescription: "Whole House Micron Water Filtration",
    shortDescription: "A comprehensive 5-level purification system that treats water at its entry point, providing bottled-quality water from every tap in your home for drinking, bathing, & laundry.",
    description: [
      "The Hello Water Whole Home Purification System uses an advanced 5-level, 3-stage process to treat water at the point it enters your home, ensuring every tap provides clean, filtered water for drinking, bathing, & laundry.",
      "Stage 1 utilizes powerful dual-gradient sediment filtration technology (0.5 micron nominal) to capture sand, silt, rust & organic material, preventing physical contaminants from entering your plumbing & extending the life of downstream filters.",
      "Stage 2 features high-capacity granular activated carbon to target chemical contaminants, including chlorine, chloramine, PFAS, pesticides, & industrial solvents, significantly improving the taste, smell, & overall safety of your water.",
      "Stage 3 employs a powerful combination of KDF-55 redox media & coconut shell carbon to reduce heavy metals (lead, mercury, copper), fluoride, & microplastics while inhibiting bacterial growth & reducing scale buildup.",
      "Designed for high household demand with a peak flow rate of up to 75 litres per minute, this system is ideal for medium-to-large homes, providing a sustainable & cost-effective, eco-friendly alternative to bottled water.",
    ],
    features: [
      "5-level, 3-stage purification",
      "Dual-gradient sediment filtration (0.5 micron)",
      "Redox (KDF 55 media) technology",
      "Heavy metal & fluoride reduction",
      "Scale inhibition & appliance protection",
      "75L/min high-flow capacity",
      "NSF, AS/NZS 4020 & WaterMark certified components",
    ],
  },
  {
    id: 3,
    slug: "uv-radiation-micro-filtration-system",
    name: "UV Water Treatment & Micro Filtration System",
    category: "Filtration Systems",
    price: "Call for Price",
    recent: false,
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1775210312/IMG_5633_flxnla.jpg",
    imageAlt: "UV Radiation Micro Filtration System all-in-one unit",
    cardDescription: "UV Water Purification System",
    shortDescription: "An advanced all-in-one sterilization system that uses high-performance ultraviolet technology to eliminate 99.9999% of bacteria, combined with multi-stage filtration for pure, chemical-free water.",
    description: [
      "The Pentair®/Pentek® UV Micro Filtration System is a complete whole-house solution that combines advanced multi-stage filtration with high-performance ultraviolet sterilization for pure, safe water.",
      "The core UV technology is tested to eliminate 99.9999% of harmful bacteria, such as E. coli, using a natural, chemical-free purification process that is safe for your family & the environment.",
      "Integrated filtration reduces sediment, dirt, rust, & chlorine, ensuring crystal-clear & better-tasting water for drinking, cooking, & showering throughout your entire home.",
      "Built with durable, commercial-grade components, the system is suitable for mains, rain, & surface water applications, with versatile indoor or outdoor installation options.",
      "Includes a convenient UV lamp countdown timer & performance alarm to ensure the system consistently operates at peak efficiency, providing complete peace of mind.",
    ],
    features: [
      "99.9999% E. coli & bacteria removal",
      "Chemical-free UV purification",
      "Whole-house multi-stage filtration",
      "1 Micron filtration rating",
      "UV lamp timer & performance alarm",
      "Suitable for mains & rainwater",
      "NSF, SGS, AS/NZS 4020 & WaterMark certified components",
    ],
  },
  {
    id: 4,
    slug: "micron-replacement-cartridge",
    name: "Pentek DGD Series",
    category: "Cartridges",
    price: "$49.00 + GST",
    recent: false,
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1775210313/IMG_5632_shvqsa.jpg",
    imageAlt: "Micron Replacement Cartridge Dual for sediment reduction",
    cardDescription: "For Sediment Reduction",
    shortDescription: "A high-capacity sediment reduction cartridge made from 100% pure polypropylene, offering up to three times the dirt-holding capacity of standard filters to protect your home's plumbing & appliances.",
    description: [
      "DGD Series cartridges are manufactured from 100% pure polypropylene & are specifically designed for use in Pentair®/Pentek® Big Blue filter housings.",
      "Engineered for purity, these cartridges do not impart any taste, odor, or colour to the water being filtered. The polypropylene construction also provides excellent chemical resistance & is naturally resistant to bacterial growth, ensuring reliable & hygienic filtration.",
      "The advanced design of the DGD Series combines efficient pre-filtration with selective final filtration, delivering up to three times the dirt-holding capacity of comparable sediment cartridges. This capacity even exceeds that of traditional spun or string-wound filters of the same size.",
      "A larger cartridge diameter reduces the particle load on the filter media, allowing it to operate effectively at higher flow velocities while maintaining strong filtration performance. In addition, the effective filtration depth is increased to 233% of standard cartridges, significantly improving particulate reduction & extending filter life.",
      "Thanks to their robust design & high performance, DGD Series cartridges are an excellent choice for residential, rural & municipal water filtration applications.",
    ],
    features: [
      "Manufactured from pure 100% polypropylene",
      "Spun fibers form a gradient density from outer to inner surfaces",
      "Designed for purity & chemical compatibility",
      "Nominal 0.5, 5, 25 micron ratings",
    ],
  },
  {
    id: 5,
    slug: "pentair-chemical-reduction-cartridges",
    name: "Pentek RFC Series",
    category: "Cartridges",
    price: "$95.00 + GST",
    recent: false,
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774892293/IMG_5156_ow9icg.jpg",
    imageAlt: "Pentair RFC Series radial flow carbon cartridges",
    cardDescription: "Radial flow carbon cartridges for chemical reduction",
    shortDescription: "Premium radial-flow carbon cartridges designed to significantly reduce chlorine, unpleasant tastes, & odours while maintaining high water pressure, ideal for point-of-entry home filtration.",
    description: [
      "RFC Series cartridges from Pentair®/Pentek® are engineered for reliable, high-performance water filtration. Each cartridge is built with a 70-micron porous polyethylene outer shell & durable polypropylene end-caps, ensuring long-lasting structural integrity & consistent performance.",
      "The 4½-inch diameter cartridge use a spun polypropylene core for added strength in higher-capacity applications. Between the outer shell & the core is a bed of high-quality granular activated carbon (GAC), designed to effectively reduce chlorine, unpleasant tastes, & odours from water.",
      "The RFC Series uses a unique radial flow design, allowing water to pass efficiently through the carbon media. This design delivers the key benefits of GAC filtration -low pressure drop & excellent contaminant reduction- while significantly minimizing the release of carbon fines, which are often associated with traditional GAC cartridges.",
      "RFC Series cartridges are ideal for point-of-entry (POE) filtration systems & other high-flow residential applications where consistent water quality & reliable performance are essential.",
    ],
    features: [
      "Provides effective chlorine taste & odour reduction",
      "Unique design reduces carbon fines in filtered water",
      "Pentek RFC Cartridges are ideal for point-of-entry (POE) & other high flow rate applications",
    ],
  },
  {
    id: 6,
    slug: "pentair-coconut-shell-carbon-cartridges",
    name: "Pentek DBC Series",
    category: "Cartridges",
    price: "$135.00 + GST",
    recent: false,
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774892294/IMG_5157_bewjhh.jpg",
    imageAlt: "Pentair Coconut Shell Carbon Cartridges enhanced with KDF",
    cardDescription: "Enhanced with KDF. Minimize heavy metals & chemicals for water filtration",
    shortDescription: "An advanced coconut-shell carbon filter enhanced with KDF-55 media, specifically engineered to reduce heavy metals & harmful chemicals while preventing lime & scale buildup in your pipes.",
    description: [
      "DBC Series cartridges from Pentair®/Pentek® are designed to deliver high-capacity filtration & enhanced protection against scale buildup. Each cartridge is enhanced with KDF 55 media, which helps inhibit the formation of lime & scale buildup that can damage plumbing systems & household appliances.",
      "These cartridges are constructed using high-performance granular activated coconut shell carbon, providing effective reduction of chlorine, chloramine, fluoride, micro-plastics, unpleasant tastes, & odours in water. To further improve filtration performance, they include a 5-micron spun-bonded polypropylene post-sediment element, which increases dirt-holding capacity & captures fine particles.",
      "The combination of advanced carbon filtration & KDF technology makes UDS & DBC Series cartridges ideal for high-capacity applications, particularly in environments where chlorine reduction & scale control are essential for maintaining water quality & protecting equipment.",
    ],
    features: [
      "Bodies are constructed with high grade polypropylene or polystyrene",
      "Spin & sonic welding assembly assures a uniform hermetic seal, which improves overall reliability",
      "Cartridge volumes are some of the highest in the industry",
      "Maximum Pressure: 125 PSI",
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
