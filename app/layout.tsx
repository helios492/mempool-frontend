import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/app/context/AuthContext";
import { PaymentProvider } from "@/app/context/PaymentContext";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eon's MemPool",
  description: "Eon's MemPool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Suspense>
          <AuthProvider>
            <PaymentProvider>
              {children}
            </PaymentProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
