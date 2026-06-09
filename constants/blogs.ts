import avatarIcon from "@/assets/logos/icon.png";
import { StaticImageData } from "next/image";

export interface BlogParagraph {
  type: "text" | "heading" | "list" | "quote" | "sources";
  text?: string;
  items?: string[];
}

export interface BlogSource {
  name: string;
  url: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: StaticImageData;
  };
  content: BlogParagraph[];
  sources?: BlogSource[];
}

export const blogs: BlogPost[] = [
  {
    slug: "pfas-lawsuit-australia",
    title: "Australia’s $2 Billion PFAS Lawsuit: Why Aussies Are Suddenly Questioning Their Water",
    subtitle: "Toxic “forever chemicals” are making headlines again — & this time, it’s huge.",
    excerpt: "The Australian Government has launched a major legal case against global manufacturing giant 3M over PFAS contamination. Learn what PFAS is, why it matters, and what you can do.",
    coverImage: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1780986794/pfas-blog_kmg4i8.webp",
    publishedAt: "June 9, 2026",
    readTime: "4 min read",
    author: {
      name: "Hello Water Filtration",
      role: "Water Quality Experts",
      avatar: avatarIcon
    },
    content: [
      {
        type: "text",
        text: "The Australian Government has launched a major legal case against global manufacturing giant 3M over PFAS contamination linked to firefighting foam used at Defence sites across the country."
      },
      {
        type: "text",
        text: "According to ABC News Australia, the government is seeking more than $2 billion in damages in what’s being described as the Commonwealth’s “largest ever” legal claim."
      },
      {
        type: "text",
        text: "The chemicals at the centre of it all? PFAS — better known as “forever chemicals”."
      },
      {
        type: "heading",
        text: "So… What Exactly Are PFAS?"
      },
      {
        type: "text",
        text: "PFAS (short for per- & polyfluoroalkyl substances) are man-made chemicals used in products designed to resist heat, grease, stains, oil, & water."
      },
      {
        type: "text",
        text: "They’ve been used for decades in things like:"
      },
      {
        type: "list",
        items: [
          "firefighting foam",
          "non-stick products",
          "industrial manufacturing",
          "water-resistant materials"
        ]
      },
      {
        type: "heading",
        text: "The problem?"
      },
      {
        type: "text",
        text: "They break down incredibly slowly — which is why they’ve earned the nickname “forever chemicals”."
      },
      {
        type: "text",
        text: "Reuters reported that the Australian Government alleges 3M knew about environmental risks linked to PFAS-containing firefighting foam while continuing to market the products as safe & biodegradable."
      },
      {
        type: "text",
        text: "Over time, PFAS contamination has become a growing issue across Australia, especially near Defence bases & firefighting training sites where these foams were heavily used."
      },
      {
        type: "heading",
        text: "Why Should Everyday Australians Care?"
      },
      {
        type: "text",
        text: "Because stories like this make people stop & ask: “What’s actually coming out of my tap?”"
      },
      {
        type: "text",
        text: "While Australia maintains a highly regulated drinking water framework through measures such as the Australian Drinking Water Guidelines (ADWG) & the WaterMark Certification Scheme, increasing media coverage of PFAS contamination & other emerging pollutants is prompting many Australians to take a closer interest in the quality of their drinking water. As awareness grows, consumers are becoming more conscious of potential environmental contaminants & are seeking greater assurance about what may be flowing through their homes every day."
      },
      {
        type: "text",
        text: "Importantly, this isn't just an issue affecting remote locations."
      },
      {
        type: "text",
        text: "Some of Australia's most widely reported PFAS contamination investigations have occurred along the East Coast, including areas surrounding RAAF Base East Sale in Victoria's Gippsland region, HMAS Cerberus on Victoria's Mornington Peninsula, RAAF Base Williamtown near Newcastle, RAAF Base Richmond in Western Sydney, RAAF Base Amberley near Ipswich, HMAS Albatross on the NSW South Coast & the Army Aviation Centre Oakey in Queensland."
      },
      {
        type: "text",
        text: "In many cases, contamination concerns extended beyond Defence boundaries into surrounding communities, waterways, fishing areas, groundwater systems, & local agricultural regions."
      },
      {
        type: "text",
        text: "Communities near affected areas have previously faced concerns involving:"
      },
      {
        type: "list",
        items: [
          "Groundwater contamination",
          "Fishing areas",
          "Local produce",
          "Environmental exposure concerns"
        ]
      },
      {
        type: "text",
        text: "As a result, PFAS contamination is no longer viewed as a distant environmental issue. For many Australians, it has become part of a broader conversation about water quality, environmental responsibility, & understanding what's in their water."
      },
      {
        type: "heading",
        text: "What Can You Actually Do About It?"
      },
      {
        type: "text",
        text: "First — stay informed."
      },
      {
        type: "text",
        text: "Understanding your local water quality, learning about potential contaminants, & knowing what’s in your household water can help you make smarter decisions for your family."
      },
      {
        type: "text",
        text: "Many Australians are also exploring additional water filtration solutions as part of a broader approach to cleaner, better-quality water at home."
      },
      {
        type: "quote",
        text: "At Hello Water Filtration, we believe every Aussie deserves cleaner, fresher, better-quality water — without the guesswork."
      },
      {
        type: "text",
        text: "Stories like this are a reminder that understanding your water matters more than ever. If you’re ready to take control of your home’s water quality, explore our advanced filtration solutions & discover how cleaner water can make a difference for your family every single day."
      }
    ],
    sources: [
      {
        name: "ABC News Australia - Federal government sues 3M Australia over PFAS firefighting foam",
        url: "https://www.abc.net.au/news/2026-05-28/federal-government-sues-3m-australia-pfas-firefighting-foam/106731552"
      },
      {
        name: "Reuters - Australia sues 3M for $1.4 billion over PFAS 'forever chemicals' contamination",
        url: "https://www.reuters.com/world/australia-sues-3m-14-billion-over-pfas-forever-chemicals-contamination-2026-05-28/"
      },
      {
        name: "The Guardian Australia - Australia sues 3M for record-breaking sum over PFAS 'forever chemicals' in firefighting foam",
        url: "https://www.theguardian.com/australia-news/2026/may/28/australia-sues-3m-record-breaking-sum-pfas-forever-chemicals-in-firefighting-foam"
      },
      {
        name: "News.com.au - Government sues 3M for $2bn over 'forever chemical' contamination at Defence sites",
        url: "https://www.news.com.au/national/government-sues-3m-for-2bn-over-forever-chemical-contamination-at-defence-sites/news-story/db978657849126f0ba85d93e47fcd61a"
      }
    ]
  },
  {
    slug: "toxic-algal-bloom-threat-australia",
    title: "The Toxic Algal Bloom Threat Growing In Australian Waters",
    subtitle: "A major marine algal bloom affecting parts of South Australia has put water quality back in the spotlight.",
    excerpt: "Scientists warn environmental conditions are creating the perfect environment for more frequent outbreaks. Discover the impact on drinking water and local ecosystems.",
    coverImage: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1780986792/algal-bloom-blog_yxznao.webp",
    publishedAt: "June 9, 2026",
    readTime: "4 min read",
    author: {
      name: "Hello Water Filtration",
      role: "Water Quality Experts",
      avatar: avatarIcon
    },
    content: [
      {
        type: "text",
        text: "A major marine algal bloom affecting parts of South Australia has put water quality back in the spotlight, with scientists warning that environmental conditions may be creating the perfect environment for more frequent outbreaks."
      },
      {
        type: "text",
        text: "While harmful algal blooms are not a new phenomenon, experts say warmer temperatures, nutrient runoff, & changing weather conditions are increasing the risk of outbreaks across Australia."
      },
      {
        type: "text",
        text: "The Murray-Darling Basin Authority has also reported elevated blue-green algae risks in several regions during 2026."
      },
      {
        type: "heading",
        text: "What Are Harmful Algal Blooms?"
      },
      {
        type: "text",
        text: "Despite their name, blue-green algae are not actually algae. They are a type of bacteria known as cyanobacteria that naturally occur in Australian waterways."
      },
      {
        type: "text",
        text: "Under the right conditions, these organisms can multiply rapidly, forming what is known as a harmful algal bloom. Some harmful algal blooms can produce toxins that pose risks to people, pets, wildlife, & aquatic ecosystems. They can also lead to waterway closures, impact drinking-water treatment processes, & affect the taste & odour of water supplied to homes & communities."
      },
      {
        type: "heading",
        text: "South Australia's Bloom Draws National Attention"
      },
      {
        type: "text",
        text: "Much of the recent attention has focused on South Australia's ongoing marine algal bloom, which has affected coastal communities, marine habitats, tourism operators, & commercial fishing industries."
      },
      {
        type: "text",
        text: "ABC News & The Guardian has reported that a second wave \"could be imminent\" highlighting ongoing concern among scientists monitoring the event."
      },
      {
        type: "heading",
        text: "The Growing Connection Between Climate Conditions & Water Quality"
      },
      {
        type: "text",
        text: "Experts say harmful algal blooms often occur when several environmental factors align."
      },
      {
        type: "text",
        text: "Warmer temperatures can accelerate algae growth, while lower river flows & extended dry periods can create conditions where blooms are more likely to thrive."
      },
      {
        type: "text",
        text: "At the same time, nutrient runoff entering rivers, reservoirs, lakes, & coastal waters can provide the fuel needed for rapid growth."
      },
      {
        type: "text",
        text: "The South Australian event has highlighted the growing connection between climate conditions, nutrient runoff, & water-quality problems, with scientists continuing to examine how these factors may influence future bloom events across Australia."
      },
      {
        type: "heading",
        text: "What Does This Mean For Australians?"
      },
      {
        type: "text",
        text: "For most Australians, harmful algal blooms are a reminder that water quality is influenced by far more than what happens at the treatment plant."
      },
      {
        type: "text",
        text: "While Australia's drinking water remains highly regulated, events such as harmful algal blooms highlight the complex environmental factors that can influence water quality. They also demonstrate the significant monitoring, treatment, & management required to maintain safe drinking water supplies."
      },
      {
        type: "text",
        text: "When blooms occur, water providers may need to increase treatment processes to manage potential impacts, including toxins, taste, & odour issues."
      },
      {
        type: "text",
        text: "Beyond drinking water, harmful algal blooms can affect recreational waterways, local ecosystems, fishing activities, tourism operators, & regional communities, demonstrating how closely environmental health & water quality are connected."
      },
      {
        type: "text",
        text: "Understanding where your water comes from & the factors that influence its quality is becoming increasingly important as Australia faces evolving environmental challenges."
      },
      {
        type: "text",
        text: "Events like South Australia's ongoing algal bloom serve as a reminder that healthy waterways are essential to healthy communities. From rivers & reservoirs to coastal ecosystems, the condition of Australia's water sources has a direct impact on the quality of the water we rely on every day."
      },
      {
        type: "text",
        text: "As environmental challenges continue to evolve, understanding the factors that influence water quality is becoming increasingly important. Whether it's harmful algal blooms, changing weather patterns, or nutrient runoff entering waterways, staying informed helps Australians better understand the complex journey water takes before it reaches their homes."
      },
      {
        type: "quote",
        text: "At Hello Water Filtration, we're passionate about helping Australians better understand their water. Because the more we know about the factors affecting our rivers, reservoirs, catchments, & drinking water supplies, the better equipped we are to make informed decisions about the water we use every day."
      }
    ],
    sources: [
      {
        name: "ABC News - Second wave of algal bloom moving through Spencer Gulf, SA",
        url: "https://www.abc.net.au/news/2026-05-28/second-wave-of-algal-bloom-moving-through-spencer-gulf-sa/106725954"
      },
      {
        name: "The Guardian - Toxic algal bloom in South Australia: second wave possible",
        url: "https://www.theguardian.com/environment/2026/may/30/toxic-algal-bloom-south-australia-second-wave-possible"
      },
      {
        name: "National Capital Authority - Water quality update: extreme levels of blue-green algae",
        url: "https://www.nca.gov.au/media-centre/water-quality-update-extreme-levels-blue-green-algae"
      }
    ]
  }
];
