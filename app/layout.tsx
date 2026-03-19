import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "./contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobTracker - Manage Daily Workers Efficiently",
  description: "Streamline your job sites, track attendance accurately, and automate payments with the ultimate progress tracker for modern employers and diligent workers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <body
        className={`${inter.className} bg-white`}
        style={{
          margin: 0,
          padding: 0,
          width: "100vw",
          minHeight: "100vh",
          overflowX: "hidden",
          overscrollBehavior: "none",
        }}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}