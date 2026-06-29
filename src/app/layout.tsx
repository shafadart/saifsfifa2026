import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tv-mama-live.com"), // Placeholder domain
  title: "MaMa TV - FIFA World Cup 2026 Live Stream",
  description: "Watch live FIFA World Cup 2026 matches in high definition. Powered by Saif Dart.",
  keywords: "FIFA, World Cup 2026, Live Stream, Football, Soccer, MaMa TV, Live Match",
  openGraph: {
    title: "MaMa TV - FIFA World Cup 2026",
    description: "Watch live FIFA World Cup 2026 matches in 4K resolution. Join the live chat and never miss a goal!",
    url: "https://tv-mama-live.com", // Placeholder domain
    siteName: "MaMa TV",
    images: [
      {
        url: "/assets/fifalogo.png", 
        width: 800,
        height: 600,
        alt: "FIFA World Cup 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MaMa TV - FIFA World Cup 2026 Live",
    description: "Watch live FIFA World Cup 2026 matches in high definition.",
    images: ["/assets/fifalogo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
