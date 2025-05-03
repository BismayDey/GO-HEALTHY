import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Go Healthy",
  description: "Go Healthy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="https://i.postimg.cc/mgFfFvyC/healthy-lifestyle.png"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
