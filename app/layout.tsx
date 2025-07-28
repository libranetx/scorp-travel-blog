import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "../components/layout/Navbar";
import { PostButtonsProvider } from "../context/PostButtonsContext";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { Providers } from './providers';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Blog",
  description: "A simple blog application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PostButtonsProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
        
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
            <Navbar />
            <main className="min-h-screen bg-gray-50">{children}</main>
            <Footer />
          
          </Providers>
        </body>
      </html>
    </PostButtonsProvider>
  );
}
