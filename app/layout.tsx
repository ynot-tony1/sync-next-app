import "./globals.css";
import React from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "Syncnet • Home",
  description:
    "Syncnet • Upload and automatically sync your video files with perfect accuracy.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />             
      <body>
        <Providers>       
          {children}
        </Providers>
      </body>
    </html>
  );
}
