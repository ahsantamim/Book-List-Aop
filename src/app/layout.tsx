import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book List Manager",
  description: "Manage your book collection with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#363636',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
              },
              success: {
                style: {
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #dcfce7',
                },
              },
              error: {
                style: {
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fee2e2',
                },
                duration: 4000,
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
