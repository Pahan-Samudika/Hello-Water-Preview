import TestimonialsComponent, { type TestimonialItem } from "@/components/shadcn-studio/blocks/testimonials-component-18/testimonials-component-18";
import { testimonials as rawTestimonials } from "@/constants/testimonials";
import { MotionWrapper } from "@/components/custom/motion-wrapper";

export const metadata = {
	title: "Testimonials | Hello Water Filtration",
	description:
		"See what our satisfied customers have to say about Hello Water's premium filtration systems. Real reviews from real families.",
};

export default function TestimonialsPage() {
	// Map our data to the component's expected format
	const mappedTestimonials: TestimonialItem[] = rawTestimonials.map((t) => ({
		name: t.name,
		role: t.location || "Verified Customer",
		company: "Hello Water",
		avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}&backgroundColor=00a3ff,0055ff,00d4ff&fontFamily=Inter,sans-serif`,
		rating: 5,
		content: t.quote,
	}));

	return (
		<div className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
				<MotionWrapper
					className="mb-8 space-y-4"
					variants={{
						hidden: {},
						visible: {
							transition: {
								staggerChildren: 0.15,
							},
						},
					}}
					initial="hidden"
					animate="visible"
				>
					<MotionWrapper
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
						}}
					>
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
							Testimonials
						</h1>
					</MotionWrapper>
					<MotionWrapper
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
						}}
					>
						<p className="text-muted-foreground sm:text-lg">
							At Hello Water, we focus on high-quality water filtration systems that enhance customers' lives by delivering clean, better-tasting water. Customer testimonials highlight the positive impact of our products in both homes & businesses, emphasizing health benefits & improved hydration.
						</p>
					</MotionWrapper>
				</MotionWrapper>

				<TestimonialsComponent testimonials={mappedTestimonials} />
			</section>
		</div>
	);
}
