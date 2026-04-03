export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: string;
  image: string;
  imageAlt: string;
  shortDescription: string;
  description: string[];
  features: string[];
};

export const products: Product[] = [
  {
    id: 1,
    slug: "the-bottle-water-plant-whole-house-micro-filtration",
    name: "The Whole House Bottle Water Plant",
    category: "Whole House",
    price: "Call for Price",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774892292/IMG_5153_wftjgy.jpg",
    imageAlt: "The Whole House Bottle Water Plant",
    shortDescription:
      "Whole House Micron Water Filtration. 7-10 Business Delivery Days, 12 Months Warranty Included.",
    description: [
      "Crafted with Australian conditions in mind, our UV protective casing is proudly manufactured in Australia.",
      "The model showcases an impressive high flow capacity, capable of delivering up to 48 litres per minute.",
      "Offers flexibility through various filtration options, allowing customization to address specific water treatment needs.",
      "Units bear the Water Mark certification and are manufactured in an ISO9000 certified facility.",
      "Achieves up to 98.5% chlorine removal and filters down to 1 Micron.",
    ],
    features: [
      "UV protective casing manufactured in Australia",
      "High flow capacity (48L/min)",
      "Water Mark certification",
      "ISO9000 certified manufacturing",
      "1 Micron filtration",
      "98.5% chlorine removal",
      "12 Months Warranty",
    ],
  },
  {
    id: 2,
    slug: "uv-radiation-micro-filtration-system",
    name: "UV Water Treatment & Micro Filtration System",
    category: "UV Purification",
    price: "Call for Price",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774892293/IMG_5154_jlxwkq.jpg",
    imageAlt: "UV Radiation Micro Filtration System all-in-one unit",
    shortDescription: "UV Water Purification System Australia (DIY Installation).",
    description: [
      "Delivers high-quality water to protect well-being, home, and environment using natural purification.",
      "Chemical-free process utilizing Pentair UV radiation micro technology.",
      "Multistage micro filtration and ultraviolet purification in an all-in-one unit.",
    ],
    features: [
      "Tested to remove 99.9999% of E. Coli",
      "Chemical-free purification",
      "Reduces sediment, silt, rust, and chlorine",
      "DIY installation or professional setup",
      "12 months warranty",
    ],
  },
  {
    id: 3,
    slug: "micron-replacement-cartridge",
    name: "Pentek DGD Series",
    category: "Replacement Cartridges",
    price: "$49.00 + GST",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774892292/IMG_5155_uf4ckc.jpg",
    imageAlt: "Micron Replacement Cartridge Dual for sediment reduction",
    shortDescription: "For Sediment Reduction.",
    description: [
      "DGD Series cartridges are manufactured from 100% pure polypropylene & are specifically designed for use in Pentair®/Pentek® Big Blue filter housings.",
      "Engineered for purity, these cartridges do not impart any taste, odor, or colour to the water being filtered. The polypropylene construction also provides excellent chemical resistance and is naturally resistant to bacterial growth, ensuring reliable & hygienic filtration.",
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
    id: 4,
    slug: "pentair-chemical-reduction-cartriges",
    name: "Pentek RFC Series",
    category: "Replacement Cartridges",
    price: "$95.00 + GST",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774892293/IMG_5156_ow9icg.jpg",
    imageAlt: "Pentair RFC Series radial flow carbon cartridges",
    shortDescription: "Radial flow carbon cartridges for chemical reduction.",
    description: [
      "RFC Series cartridges from Pentair®/Pentek® are engineered for reliable, high-performance water filtration. Each cartridge is built with a 70-micron porous polyethylene outer shell & durable polypropylene end-caps, ensuring long-lasting structural integrity & consistent performance.",
      "The 4½-inch diameter cartridge use a spun polypropylene core for added strength in higher-capacity applications. Between the outer shell & the core is a bed of high-quality granular activated carbon (GAC), designed to effectively reduce chlorine, unpleasant tastes, & odours from water.",
      "The RFC Series uses a unique radial flow design, allowing water to pass efficiently through the carbon media. This design delivers the key benefits of GAC filtration -low pressure drop and excellent contaminant reduction- while significantly minimizing the release of carbon fines, which are often associated with traditional GAC cartridges.",
      "RFC Series cartridges are ideal for point-of-entry (POE) filtration systems & other high-flow residential applications where consistent water quality & reliable performance are essential.",
    ],
    features: [
      "Provides effective chlorine taste & odour reduction",
      "Unique design reduces carbon fines in filtered water",
      "Pentek RFC Cartridges are ideal for point-of-entry (POE) & other high flow rate applications",
    ],
  },
  {
    id: 5,
    slug: "pentair-coconut-shell-carbon-cartridges",
    name: "Pentek DBC Series",
    category: "Replacement Cartridges",
    price: "$135.00 + GST",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774892294/IMG_5157_bewjhh.jpg",
    imageAlt: "Pentair Coconut Shell Carbon Cartridges enhanced with KDF",
    shortDescription:
      "Enhanced with KDF. Minimize heavy metals and chemicals for water filtration.",
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
