"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import NextTopLoader from "nextjs-toploader";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo/gnhub.svg" />
      </head>
      <body suppressHydrationWarning={true}>
        <TonConnectUIProvider manifestUrl="https://ivory-legal-sheep-782.mypinata.cloud/ipfs/bafkreibgpwokmv7eidnestcuon7332a5vcvjgegdvqexyds6mjjj6enluu">
          <NextTopLoader
            color="#2299DD"
            initialPosition={0.08}
            crawlSpeed={500}
            height={3}
            crawl={true}
            // showSpinner={true}
            easing="ease"
            speed={100}
            zIndex={10000}
            showAtBottom={false}
          />
          <Toaster position="top-center" reverseOrder={false} />
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : children}
          </div>
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
