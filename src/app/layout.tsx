
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cuarto turno mtto. Mecanizado.',
  description: 'Aplicación de gestión y programación de turnos para equipos.',
  applicationName: 'Cuarto turno mtto. Mecanizado.',
  appleWebApp: {
    capable: true,
    title: 'Cuarto turno mtto. Mecanizado.',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json", // Ya lo configuramos con next-pwa, pero no está de más
};

export const viewport: Viewport = {
  themeColor: '#3F51B5', // Coincide con el theme_color del manifest
  // width: 'device-width', // next/font se encarga de esto bien
  // initialScale: 1,
  // maximumScale: 1,
  // userScalable: false,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* <meta name="mobile-web-app-capable" content="yes" /> No es necesario con manifest */}
        {/* Los iconos se definen en el manifest */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
