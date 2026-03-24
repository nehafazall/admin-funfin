import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Lato } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLT trading Academy",
  description: "CLT trading Academy",
};

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.className}`} suppressHydrationWarning>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className={"overflow-hidden"}>
        <NextTopLoader color="red" shadow="0 0 10px 5px red" showSpinner={false} />
        <NuqsAdapter>
          <Providers session={null}>
            <Toaster theme="light"/>
            {children}
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
