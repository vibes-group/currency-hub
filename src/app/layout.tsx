import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/config/styles/globals.css";

import { ThemeProvider } from "@/features/change-theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Currency Hub",
  description: "Mobile-first currency tracking PWA",
};

const themeInitScript = `
(() => {
  try {
    const storageKey = "currency-hub-theme";
    const storedMode = localStorage.getItem(storageKey);
    const mode = storedMode === "light" || storedMode === "dark" || storedMode === "system" ? storedMode : "system";
    const resolvedMode = mode === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode;
    document.documentElement.classList.toggle("dark", resolvedMode === "dark");
    document.documentElement.style.colorScheme = resolvedMode;
  } catch {
    document.documentElement.style.colorScheme = "light";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
