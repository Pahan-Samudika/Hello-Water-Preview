"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { Button } from "@/components/ui/button";
import { navigationData } from "@/components/header";
import { XIcon, MenuIcon } from "lucide-react";
import Link from "next/link";

export function MobileNav() {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="md:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				{open ? (
					<XIcon className="size-4.5" />
				) : (
					<MenuIcon className="size-4.5" />
				)}
			</Button>
			{open && (
				<Portal className="top-[4.375rem] z-50" id="mobile-menu">
					<PortalBackdrop />
					<div
						className={cn(
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
							"size-full p-4"
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="grid gap-y-1">
							{navigationData.map((item) => (
								<div key={item.title}>
									<Button
										className="justify-start w-full font-semibold"
										variant="ghost"
										render={<Link href={item.href} />}
										nativeButton={false}
										onClick={() => setOpen(false)}
									>
										{item.title}
									</Button>
									{item.children?.map((child) => (
										<Button
											key={child.href}
											className="justify-start w-full pl-8 opacity-80"
											variant="ghost"
											render={<Link href={child.href} />}
											nativeButton={false}
											onClick={() => setOpen(false)}
										>
											{child.title}
										</Button>
									))}
								</div>
							))}
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}
