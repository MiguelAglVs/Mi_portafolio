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
                expand={false}
                richColors
                closeButton
                theme="light" // Puedes cambiar a "dark" o "system" según necesites
                toastOptions={{
                  classNames: {
                    toast:
                      "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                      "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                      "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                    // Estilos específicos para diferentes tipos de toast
                    success:
                      "group-[.toaster]:border-green-500/50 group-[.toaster]:bg-green-50 dark:group-[.toaster]:bg-green-950/30",
                    error:
                      "group-[.toaster]:border-red-500/50 group-[.toaster]:bg-red-50 dark:group-[.toaster]:bg-red-950/30",
                    warning:
                      "group-[.toaster]:border-yellow-500/50 group-[.toaster]:bg-yellow-50 dark:group-[.toaster]:bg-yellow-950/30",
                    info: "group-[.toaster]:border-blue-500/50 group-[.toaster]:bg-blue-50 dark:group-[.toaster]:bg-blue-950/30",
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
