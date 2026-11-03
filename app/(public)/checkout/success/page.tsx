import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/db-queries";
import { hasOrderAccess } from "@/lib/order-access";
import { createMetadata } from "@/lib/seo";
import { CheckCircle2, ShoppingBag, PhoneCall, Printer, MapPin, Mail, Phone, Calendar, ShieldCheck } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";

export const revalidate = 0;

export const metadata: Metadata = createMetadata({
  title: "Order Success | Hello Water Filtration",
  description: "Thank you for your cartridge order. Your payment was processed successfully.",
  path: "/checkout/success",
  noIndex: true,
});

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

function OrderNotice({ title, message }: { title: string; message: string }) {
  return (
    <main className="relative overflow-hidden w-full min-h-screen flex items-center justify-center py-16 px-6">
      <div className="max-w-md w-full text-center space-y-6 rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
        <div className="mx-auto rounded-full bg-destructive/10 p-6 text-destructive w-fit">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center px-8 rounded-full bg-primary text-sm font-black text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/10 w-full"
        >
          Browse Products
        </Link>
      </div>
    </main>
  );
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    notFound();
  }

  const order = await getOrderById(orderId);

  // Missing orders and orders this browser did not place get the same response,
  // so the page cannot be used to probe which order IDs exist.
  if (!order || !(await hasOrderAccess(order.id, order.accessTokenHash))) {
    return (
      <OrderNotice
        title="Order Details Unavailable"
        message="We can't show this order on this device. Your receipt has been emailed to you. If you need help, please call 1300 515 469."
      />
    );
  }

  if (order.status === "Pending") {
    return (
      <OrderNotice
        title="Payment Not Completed"
        message="We haven't received payment for this order yet. If you were charged, please call 1300 515 469 and we'll sort it out."
      />
    );
  }

  return (
    <main className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-4xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
        {/* Success Header Card */}
        <div className="text-center space-y-4 mb-8 md:mb-12">
          <div className="mx-auto rounded-full bg-emerald-500/10 p-4 text-emerald-400 w-fit animate-pulse">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
            Thank you for your order!
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Payment has been successfully processed via PayPal. Your order reference is <strong className="text-foreground">{order.id}</strong>. A receipt has been sent to <strong className="text-foreground">{order.customer.email}</strong>.
          </p>
        </div>

        {/* Invoice Grid */}
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] items-start">
          {/* Left Column: Order Breakdown & Invoice Items */}
          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-border/40 bg-card/25 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border/30">
                <h2 className="text-lg font-bold text-foreground">Order Items</h2>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                  {order.status}
                </span>
              </div>

              {/* Item List */}
              <div className="divide-y divide-border/20 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-muted/40">
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        useNextImage
                        fill
                        sizes="64px"
                        containerClassName="h-full w-full"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-bold text-sm text-foreground line-clamp-2" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Quantity: {item.quantity} @ {item.priceString}
                      </p>
                    </div>
                    <div className="text-right font-bold text-sm text-foreground shrink-0 pt-1">
                      ${(item.priceNumeric * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Math */}
              <div className="border-t border-border/40 pt-4 space-y-2.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal (excl. GST)</span>
                  <span className="font-semibold text-foreground">${order.subtotal.toFixed(2)} AUD</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>GST (10%)</span>
                  <span className="font-semibold text-foreground">${order.gst.toFixed(2)} AUD</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Standard Delivery (Flat Rate)</span>
                  <span className="font-semibold text-foreground">${order.shipping.toFixed(2)} AUD</span>
                </div>
                <div className="border-t border-border/40 pt-3 flex justify-between text-base font-black text-foreground">
                  <span>Total Amount Paid</span>
                  <span className="text-primary text-lg">${order.total.toFixed(2)} AUD</span>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="rounded-[2rem] border border-border/40 bg-card/25 backdrop-blur-xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-bold text-sm text-foreground">Need help with installation or compatibility?</h3>
                <p className="text-xs text-muted-foreground">Our customer success team is available Monday to Friday.</p>
              </div>
              <a
                href="tel:1300515469"
                className="inline-flex h-10 items-center gap-2 px-5 bg-primary/25 text-primary hover:bg-primary/35 font-bold rounded-full text-xs transition-colors shrink-0"
              >
                <PhoneCall className="size-3.5" />
                1300 515 469
              </a>
            </div>
          </div>

          {/* Right Column: Customer Info & Metadata */}
          <div className="space-y-6">
            {/* Delivery address */}
            <div className="rounded-[2.5rem] border border-border/40 bg-card/25 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-foreground pb-2 border-b border-border/30 flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                Delivery Information
              </h2>

              <div className="space-y-3.5 text-xs">
                <p className="font-bold text-foreground">{order.customer.name}</p>
                <p className="text-muted-foreground flex items-center gap-2 leading-relaxed">
                  <MapPin className="size-3.5 shrink-0" />
                  <span>
                    {order.customer.address},<br />
                    {order.customer.suburb}, {order.customer.state} {order.customer.postcode}<br />
                    Australia
                  </span>
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="size-3.5 shrink-0" />
                  <span>{order.customer.email}</span>
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Phone className="size-3.5 shrink-0" />
                  <span>{order.customer.phone}</span>
                </p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="rounded-[2.5rem] border border-border/40 bg-card/25 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-foreground pb-2 border-b border-border/30 flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Payment Record
              </h2>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-bold text-foreground uppercase">{order.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-foreground break-all max-w-[120px]" title={order.payment.id}>
                    {order.payment.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payer Account:</span>
                  <span className="text-foreground truncate max-w-[120px]" title={order.payment.payerEmail}>
                    {order.payment.payerEmail}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Date:</span>
                  <span className="text-foreground flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Back Home CTA */}
            <Link
              href="/"
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-border/60 hover:bg-muted/50 text-xs font-bold text-foreground transition-all w-full"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
