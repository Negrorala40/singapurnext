import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Fredoka } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

// Fuentes que ya tienes
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Nueva fuente Fredoka que deseas agregar
const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'A marte', // Aquí puedes poner el título que desees
  description: 'tu felicidad', // Y también la descripción
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} ${fredoka.className}`}>
        <AuthProvider>
          <Header />
          <main className="app-container">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
