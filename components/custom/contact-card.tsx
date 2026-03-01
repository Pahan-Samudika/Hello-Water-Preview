import { cn } from "@/lib/utils";
import type React from "react";
import { DecorIcon } from "@/components/ui/decor-icon";

type ContactInfoProps = React.ComponentProps<"div"> & {
	icon: React.ReactNode;
	label: string;
	value: string;
};

type ContactCardProps = React.ComponentProps<"div"> & {
	// Content props
	title?: string;
	description?: string;
	contactInfo?: ContactInfoProps[];
	formSectionClassName?: string;
};

export function ContactCard({
	title = "Contact With Us",
	description = "If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day.",
	contactInfo,
	className,
	formSectionClassName,
	children,
	...props
}: ContactCardProps) {
	return (
		<div
			className={cn(
				"relative grid h-full w-full border border-border/60 bg-background md:grid-cols-2 lg:grid-cols-3",
				className
			)}
			{...props}
		>
			<DecorIcon position="top-left" />
			<DecorIcon position="top-right" />
			<DecorIcon position="bottom-left" />
			<DecorIcon position="bottom-right" />

			<div className="col-span-1 flex flex-col justify-between bg-muted/30 lg:col-span-2 dark:bg-background/40">
				<div className="relative h-full space-y-4 px-4 py-8 md:p-8">
					<h1 className="font-semibold text-3xl md:text-4xl lg:text-5xl">
						{title}
					</h1>
					<p className="max-w-7xl text-muted-foreground text-sm md:text-base lg:text-lg">
						{description}
					</p>
					<div className="flex flex-col gap-4 pt-4 md:gap-2 md:pt-8">
						{contactInfo?.map((info) => (
							<ContactInfo key={info.label} {...info} />
						))}
					</div>
				</div>
			</div>
			<div
				className={cn(
					"col-span-1 flex h-full w-full items-center border-t border-border/60 bg-card px-4 py-8 md:border-t-0 md:border-l dark:bg-card/30",
					formSectionClassName
				)}
			>
				{children}
			</div>
		</div>
	);
}

function ContactInfo({
	icon,
	label,
	value,
	className,
	...props
}: ContactInfoProps) {
	return (
		<div className={cn("flex items-center gap-3 py-3", className)} {...props}>
			<div className="rounded-lg border bg-card p-3 shadow [&_svg]:size-5">
				{icon}
			</div>
			<div>
				<p className="font-medium">{label}</p>
				<p className="text-muted-foreground text-xs">{value}</p>
			</div>
		</div>
	);
}
