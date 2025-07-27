import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LITE-ERP",
  description: "Un ERP ligero pero poderoso",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
