import { cn } from "@/lib/utils";
import type React from "react";

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
				"relative grid h-full w-full md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-center",
				className
			)}
			{...props}
		>
			<div className="col-span-1 flex flex-col justify-center px">
				<div className="relative space-y-6">
					<h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
						{title}
					</h1>
					<p className="max-w-xl text-muted-foreground text-base lg:text-lg">
						{description}
					</p>
					<div className="flex flex-col gap-6 pt-4">
						{contactInfo?.map((info) => (
							<ContactInfo key={info.label} {...info} />
						))}
					</div>
				</div>
			</div>
			<div
				className={cn(
					"col-span-1 flex w-full flex-col bg-card/90 backdrop-blur-xl rounded-[2.5rem] border shadow-2xl p-6 sm:p-10",
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
		<div className={cn("flex items-start gap-5", className)} {...props}>
			<div className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary [&_svg]:size-5">
				{icon}
			</div>
			<div className="space-y-1">
				<p className="font-semibold text-lg">{label}</p>
				<p className="text-muted-foreground text-base">{value}</p>
			</div>
		</div>
	);
}
