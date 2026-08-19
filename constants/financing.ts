import { Laptop, Calculator, CreditCard, Wrench } from "lucide-react";
import { TimelineData } from "@/components/custom/timeline";

export const howItWorksData: TimelineData[] = [
  {
    timeframe: "Step 1",
    title: "Choose Your Preferred System",
    description: "Browse our range of high-quality water filtration systems.",
    icon: Laptop,
  },
  {
    timeframe: "Step 2",
    title: "Get your Hello Water Quote",
    description: "Receive a transparent, no-obligation quote from our team.",
    icon: Calculator,
  },
  {
    timeframe: "Step 3",
    title: "Select Brighte or Zip Money",
    description: "Pick the repayment plan that best suits your budget.",
    icon: CreditCard,
  },
  {
    timeframe: "Step 4",
    title: "Apply Together & Arrange Installation",
    description: "Get approved quickly and schedule your installation.",
    icon: Wrench,
  },
];

export const paymentOptions = [
  {
    id: "brighte",
    logoSrc: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1786892281/brighte_wvvepe.webp",
    logoAlt: "Brighte Logo",
    cardClasses: "border-[#00C896]/60 shadow-[#00C896]/10 hover:shadow-[#00C896]/20 hover:border-[#00C896]",
    gradientClasses: "from-[#00C896]/20 via-[#008266]/10",
    textColor: "text-[#00C896]",
    months: "36",
    features: [
      "No Upfront Fee",
      "5-Minute Approval Process",
      "$75 one-off establishment fee + $2.30 account keeping fee"
    ],
    pricingBg: "bg-[#008266]/10",
    pricingBorder: "border-[#00C896]/20",
    pricingDivide: "divide-[#00C896]/10",
    pricingItems: [
      { label: "36 months", value: "$45.89 / fortnight", isLargeLabel: false },
      { label: "30 months", value: "$51.14 / fortnight", isLargeLabel: false },
      { label: "24 months", value: "$62.77 / fortnight", isLargeLabel: false },
      { label: "12 months", value: "$120.95 / fortnight", isLargeLabel: false },
      { label: "6 months", value: "$235.76 / fortnight", isLargeLabel: false }
    ],
  },
  {
    id: "zip",
    logoSrc: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1786892281/zip_xmjg6b.webp",
    logoAlt: "Zip Money Logo",
    cardClasses: "border-[#A98CE4]/60 shadow-[#A98CE4]/10 hover:shadow-[#A98CE4]/20 hover:border-[#A98CE4]",
    gradientClasses: "from-[#A98CE4]/20 via-[#2A0F4D]/40",
    textColor: "text-[#A98CE4]",
    months: "24",
    features: [
      "Pay Over Time",
      "Simple Application",
      "Choose your flexible repayment rhythm"
    ],
    pricingBg: "bg-[#2A0F4D]/20",
    pricingBorder: "border-[#A98CE4]/20",
    pricingDivide: "divide-[#A98CE4]/10",
    pricingItems: [
      { label: "$9.95", value: "monthly account fee while a balance is owing", isLargeLabel: true },
      { label: "$0–$99", value: "one-off establishment fee may apply", isLargeLabel: true },
      { label: "25.9% p.a.", value: "standard variable rate after the interest-free term", isLargeLabel: true }
    ],
  }
];

export const financingDisclaimers = [
  "*Brighte 0% Interest Payment Plan: All applications for credit are subject to Brighte's credit approval. Fees, terms and conditions apply. A $75 establishment fee is payable on the first repayment date and a $2.30 weekly account keeping fee is included in repayments. A $4.99 late payment fee may apply if a repayment is missed, capped at $49.90 per calendar year. No early repayment fee applies. Other fees and charges may apply. Credit provided by Brighte Capital Pty Limited ABN 74 609 165 906, Australian Credit Licence 508217.",
  "*Zip Money: Up to 24 months interest free is subject to the promotional offer applying to your eligible HelloWater purchase, minimum spend, approved applicants and satisfactory credit assessment. Minimum monthly repayments are required. Paying only the minimum repayment will generally not repay the purchase within the interest-free period. A $9.95 monthly account fee applies and is waived when the balance owing is $0 at month end. A one-off establishment fee of $0-$99 may apply, depending on the approved credit limit. Any balance remaining after the interest-free period is charged at Zip Money's standard variable rate, currently 25.9% p.a. Fees, rates and terms are subject to change; check your contract and current terms before applying. Credit provided by ZipMoney Payments Pty Ltd ABN 58 164 440 993, Australian Credit Licence 441878."
];