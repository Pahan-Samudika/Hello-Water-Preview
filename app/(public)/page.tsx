import Link from "next/link";
import HeroSection from "@/components/shadcn-studio/blocks/hero-section/hero-section";

const highlights = [
  {
    title: "Simple setup",
    description: "Get started quickly with a clean structure and reusable UI blocks.",
  },
  {
    title: "Built for scale",
    description: "Use composable sections and shared components as your product grows.",
  },
  {
    title: "Fast iteration",
    description: "Ship changes safely with predictable routing and layout boundaries.",
  },
];

const menudata = [
  {
    id: 1,
    img: 'https://res.cloudinary.com/dnlb02zp9/image/upload/v1771561660/quxsbge2u1tn30s1ciru_qcwtyn.webp',
    imgAlt: 'plate-1',
    userComment: 'These people are in the business of making peoples life healthier.',
    userAvatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-56.png'
  },
  {
    id: 2,
    img: 'https://res.cloudinary.com/dnlb02zp9/image/upload/v1771561660/coz3uyrltwb0qmq2yuir_evprgj.webp',
    imgAlt: 'plate-2',
    userComment: 'Just had a complete home water filtration system installed and it’s been working perfectly.',
    userAvatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-46.png'
  },
  {
    id: 3,
    img: 'https://res.cloudinary.com/dnlb02zp9/image/upload/v1771561659/h3njqef1kyfc18df4hun_aburgz.webp',
    imgAlt: 'plate-3',
    userComment: 'Amazing service from start to finish!',
    userAvatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-57.png'
  },
  {
    id: 4,
    img: 'https://res.cloudinary.com/dnlb02zp9/image/upload/v1771561659/nd1np6qyyfcetzpo0efv_yrbnyh.webp',
    imgAlt: 'plate-4',
    userComment: 'Installed in 2024 December. Happy with product and service…',
    userAvatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-58.png'
  },
  {
    id: 5,
    img: 'https://res.cloudinary.com/dnlb02zp9/image/upload/v1771561659/fvcy6rcqzbq1hudhuhqu_jynsqw.webp',
    imgAlt: 'plate-3',
    userComment: 'Great customer service. Thank you Indi for your professionalism',
    userAvatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-57.png'
  }
]

export default function PublicHomePage() {
  return (
    <main className='flex flex-col'>
        <HeroSection menudata={menudata} />
      </main>
  );
}
