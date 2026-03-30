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
    name: "The Bottle Water Plant Whole House Micro Water Filtration",
    category: "Whole House",
    price: "Call for Price",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774890832/Gemini_Generated_Image_v2537ov2537ov253_kortkn.png",
    imageAlt: "The Bottle Water Plant Whole House Micro Water Filtration system",
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
    name: "UV Radiation Micro Filtration System",
    category: "UV Purification",
    price: "Call for Price",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774890833/Gemini_Generated_Image_pn84x8pn84x8pn84_bvxhts.png",
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
    name: "MICRON REPLACEMENT CARTRIDGE DUAL – PENTAIR DGD 1",
    category: "Replacement Cartridges",
    price: "$49.00 + GST",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774890821/Gemini_Generated_Image_jeqzx7jeqzx7jeqz_cmiblh.png",
    imageAlt: "Micron Replacement Cartridge Dual for sediment reduction",
    shortDescription: "For Sediment Reduction.",
    description: [
      "Manufactured from 100% pure polypropylene and sized for Big Blue filter housings.",
      "Designed for purity; does not impart taste, odor, or color to the liquid being filtered.",
    ],
    features: [
      "100% pure polypropylene",
      "Dual-gradient density design",
      "Sized for Big Blue housings",
      "3x dirt-holding capacity",
      "High particulate reduction efficiency",
    ],
  },
  {
    id: 4,
    slug: "pentair-chemical-reduction-cartriges",
    name: "CHEMICAL REDUCTION PENTAIR RFC SERIES RADIAL FLOW CARBON CARTRIDGES",
    category: "Replacement Cartridges",
    price: "$95.00 + GST",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774890844/Gemini_Generated_Image_vlbqtevlbqtevlbq_quz809.png",
    imageAlt: "Pentair RFC Series radial flow carbon cartridges",
    shortDescription: "Radial flow carbon cartridges for chemical reduction.",
    description: [
      "Constructed with a 70-micron porous polyethylene outer shell and a durable polypropylene core.",
      "Radial flow design allows for higher flow rates and lower pressure drop.",
      "Contains granular activated carbon (GAC) effective in reducing chlorine, bad taste, and odor.",
    ],
    features: [
      "70-micron porous polyethylene outer shell",
      "Radial flow design for high flow rates",
      "Granular Activated Carbon (GAC)",
      "Effective chlorine/taste/odor reduction",
    ],
  },
  {
    id: 5,
    slug: "pentair-coconut-shell-carbon-cartridges",
    name: "PENTAIR COCONUT SHELL CARBON CARTRIDGES",
    category: "Replacement Cartridges",
    price: "$135.00 + GST",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1774890842/Gemini_Generated_Image_wfd3wywfd3wywfd3_ph0x1h.png",
    imageAlt: "Pentair Coconut Shell Carbon Cartridges enhanced with KDF",
    shortDescription:
      "Enhanced with KDF. Minimize heavy metals and chemicals for water filtration.",
    description: [
      "Enhanced with KDF to minimize heavy metals and chemicals for water filtration.",
      "Designed for the high-flow requirements of commercial and industrial applications.",
    ],
    features: [
      "Enhanced with KDF",
      "Minimizes heavy metals and chemicals",
      "High-flow design",
      "UDS & DBC Series cartridges",
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
