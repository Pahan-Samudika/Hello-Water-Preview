"use client";

import { type FormEvent, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { submitEnquiryForm } from "@/app/actions/enquiry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReCAPTCHA, type ReCAPTCHARef } from "@/components/custom/recaptcha";


export function EnquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHARef>(null);
  const isSubmittingRef = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("g-recaptcha-response", recaptchaToken);

    isSubmittingRef.current = true;
    setIsPending(true);

    try {
      const result = await submitEnquiryForm(formData);

      if (result.success) {
        toast.success("Thank you! Your enquiry has been submitted successfully.");
        formRef.current?.reset();
        recaptchaRef.current?.reset();
      } else {
        toast.error(result.error || "Failed to submit enquiry. Please try again.");
        recaptchaRef.current?.reset();
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
      recaptchaRef.current?.reset();
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
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
          <Label className="pl-1 text-sm font-medium text-foreground/80">Mobile Number</Label>
          <Input
            name="mobile"
            type="tel"
            placeholder="04xx xxx xxx"
            required
            className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="pl-1 text-sm font-medium text-foreground/80">Postcode</Label>
        <Input
          name="postcode"
          type="text"
          placeholder="Enter your postcode"
          required
          className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="pl-1 text-sm font-medium text-foreground/80">Installed Address (Optional)</Label>
        <Input
          name="installed_address"
          type="text"
          placeholder="Address where you saw our system"
          className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
        />
      </div>

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={setRecaptchaToken}
      />
      <Button
        type="submit"
        disabled={isPending || !recaptchaToken}
        className="group relative mt-2 w-full overflow-hidden rounded-full py-6 text-base font-semibold shadow-lg hover:shadow-primary/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Enquiry"
        )}
      </Button>
    </form>
  );
}
