import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import Navigation from "@/components/layout/Navigation";
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
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            {children}
          </div>
          <Toaster 
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '12px 24px',
                color: '#1f2937',
                fontSize: '0.875rem',
                maxWidth: '400px',
                textAlign: 'center',
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#ffffff',
                },
                style: {
                  background: 'rgba(236, 253, 245, 0.9)',
                  border: '1px solid rgba(167, 243, 208, 0.2)',
                  color: '#065F46',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#ffffff',
                },
                style: {
                  background: 'rgba(254, 242, 242, 0.9)',
                  border: '1px solid rgba(252, 165, 165, 0.2)',
                  color: '#991B1B',
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
