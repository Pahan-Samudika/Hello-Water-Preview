import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FacebookIcon } from "lucide-react";
import txtLogoWhite from "@/assets/svg/txtlogo-white.svg";
import txtLogoBlack from "@/assets/svg/txtlogo-black.svg";

type FooterLink = {
	title: string;
	href: string;
	icon?: ReactNode;
};

type FooterSection = {
	label: string;
	links: FooterLink[];
};

const footerLinks: FooterSection[] = [
	{
		label: "Filtration Solutions",
		links: [
			{ title: "Filtration Systems", href: "/products" },
			{ title: "Cartridges", href: "/products" },
			{ title: "Technology", href: "/technology" },
			{ title: "Certifications", href: "/certifications" },
		],
	},
	{
		label: "Company",
		links: [
			{ title: "About Us", href: "/about-us" },
			{ title: "Benefits", href: "/benefits" },
			{ title: "FAQs", href: "/faq" },
			{ title: "Contact Us", href: "/contact" },
		],
	},
	// {
	// 	label: "Legal",
	// 	links: [
	// 		{ title: "Privacy Policy", href: "/privacy-policy" },
	// 		{ title: "Terms of Service", href: "/terms-of-service" },
	// 	],
	// },
	{
		label: "Social Links",
		links: [
			{
				title: "Facebook",
				href: "https://web.facebook.com/people/Hello-Water/61551773243133/",
				icon: (
					<FacebookIcon
					/>
				),
			},
			/* {
				title: "Instagram",
				href: "#",
				icon: (
					<InstagramIcon
					/>
				),
			},
			{
				title: "Youtube",
				href: "#",
				icon: (
					<YoutubeIcon
					/>
				),
			},
			{
				title: "LinkedIn",
				href: "#",
				icon: (
					<LinkedinIcon
					/>
				),
			}, */
		],
	},
];

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer
			className={cn(
				"relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center rounded-t-4xl border-t border-primary px-6 md:rounded-t-6xl md:px-8 shadow-sm",
				"dark:bg-[radial-gradient(35%_128px_at_50%_0%,--theme(--color-foreground/.1),transparent)]"
			)}
		>
			<div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/20 blur" />

			<div className="grid w-full gap-8 py-6 md:py-8 lg:grid-cols-3 lg:gap-8">
				<AnimatedContainer className="space-y-4">
					<Image src={txtLogoBlack} alt="Hello Water" className="w-36 dark:hidden" />
					<Image src={txtLogoWhite} alt="Hello Water" className="hidden w-36 dark:block" />
					<div className="text-muted-foreground space-y-1 text-sm">
						<p className="text-foreground font-semibold">VICTORIA</p>
						<p className="inline-flex items-start gap-2">
							<span>
								103/55 Victor Crs
								<br />
								Narre Warren,
								<br />
								Victoria 3805
							</span>
						</p>
						<p>1300 515 469</p>
					</div>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-2 lg:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer delay={0.1 + index * 0.1} key={section.label}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-xs">{section.label}</h3>
								<ul className="mt-4 space-y-2 text-muted-foreground text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<FooterAnchor link={link} isExternal={section.label === "Social Links"} />
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
			<div className="h-px w-full bg-linear-to-r via-border" />
			<div className="flex w-full items-center justify-center py-4">
				<p className="text-muted-foreground text-sm">
					&copy; {currentYear} Hello Water Filtration, All rights reserved
				</p>
			</div>
		</footer>
	);
}

function FooterAnchor({
	link,
	isExternal,
}: {
	link: FooterLink;
	isExternal: boolean;
}) {
	const className =
		"inline-flex items-center duration-250 hover:text-foreground [&_svg]:me-1 [&_svg]:size-4";

	if (isExternal) {
		return (
			<a
				className={className}
				href={link.href}
				target="_blank"
				rel="noopener noreferrer"
			>
				{link.icon}
				{link.title}
			</a>
		);
	}

	return (
		<Link className={className} href={link.href}>
			{link.icon}
			{link.title}
		</Link>
	);
}

function AnimatedContainer({
	className,
	delay = 0.1,
	children,
}: {
	delay?: number;
	className?: string;
	children: ReactNode;
}) {
	void delay;

	return <div className={className}>{children}</div>;
}
