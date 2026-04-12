"use client";

import Script from "next/script";

export default function TawkMessenger() {
  // Replace these with your actual IDs from Tawk.to dashboard
  const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
  const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

  return (
    <>
      <Script
        id="tawk-messenger"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `,
        }}
      />
    </>
  );
}