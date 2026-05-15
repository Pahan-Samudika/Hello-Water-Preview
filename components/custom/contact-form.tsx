"use client";

import { type FormEvent, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { submitContactForm } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmittingRef = useRef(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    isSubmittingRef.current = true;
    setIsPending(true);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        toast.success("Thank you! Your message has been sent successfully.");
        formRef.current?.reset();
      } else {
        toast.error(result.error || "Failed to send message. Please try again.");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      isSubmittingRef.current = false;
      setIsPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full space-y-5 lg:space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="pl-1 text-sm font-medium text-foreground/80">Name</Label>
        <Input
          name="name"
          type="text"
          placeholder="Your full name"
          required
          className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="pl-1 text-sm font-medium text-foreground/80">Email</Label>
        <Input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="pl-1 text-sm font-medium text-foreground/80">Suburb</Label>
        <Input
          name="suburb"
          type="text"
          placeholder="Your suburb"
          className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="pl-1 text-sm font-medium text-foreground/80">Phone</Label>
        <Input
          name="phone"
          type="tel"
          placeholder="04xx xxx xxx"
          className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="pl-1 text-sm font-medium text-foreground/80">Message</Label>
        <Textarea
          name="message"
          placeholder="Tell us what you need help with..."
          required
          className="min-h-[120px] rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50 resize-y pt-3"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="group relative mt-2 w-full overflow-hidden rounded-full py-6 text-base font-semibold shadow-lg hover:shadow-primary/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
