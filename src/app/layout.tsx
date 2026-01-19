// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mi Portfolio",
  description: "Portfolio profesional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="grow">{children}</main>
                <Footer />
              </div>
              {/* Toaster para notificaciones */}
              <Toaster
                position="top-right"
                toastOptions={{
                  className: "text-sm font-medium",
                  duration: 3000,
                  style: {
                    background: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                    border: "1px solid hsl(var(--border))",
                  },
                }}
              />
            </ThemeProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
