import type { Metadata } from "next";
import './globals.css'
import Header from "@/app/_component/Header"
import Footer from "@/app/_component/Footer"

export const metadata: Metadata = {
  title: "CMS Job Finder"
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="theme-text-main flex min-h-screen flex-col antialiased font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
