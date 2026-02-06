
import type { Metadata } from "next";
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { GoogleAnalyticsTracking } from '@/components/GoogleAnalyticsTracking';

/**
 * Configuración de metadatos SEO para buscadores y redes sociales (WhatsApp, Twitter, FB).
 */
export const metadata: Metadata = {
  title: {
    default: "Tour Weaver | Tours Virtuales 360° de Alta Gama",
    template: "%s | Tour Weaver"
  },
  description: "Plataforma profesional para la creación y exhibición de tours virtuales 360°. Eleva tus listados inmobiliarios con experiencias inmersivas premium.",
  keywords: ["tour virtual", "360", "inmobiliaria", "real estate", "vistas panorámicas", "propiedades de lujo", "Tour Weaver", "broker inmobiliario"],
  authors: [{ name: "Tour Weaver" }],
  creator: "Tour Weaver",
  metadataBase: new URL('https://tour-weaver.com'), // Cambiar por el dominio real en producción
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Tour Weaver | Tours Virtuales 360° Profesionales",
    description: "Muestra tus propiedades como nunca antes con experiencias inmersivas 360° de alta fidelidad.",
    url: "https://tour-weaver.com",
    siteName: "Tour Weaver",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://picsum.photos/seed/tourweaver-og/1200/630",
        width: 1200,
        height: 630,
        alt: "Tour Weaver Virtual Experience Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tour Weaver | Tours Virtuales 360°",
    description: "La mejor solución de visualización inmersiva para el mercado inmobiliario.",
    images: ["https://picsum.photos/seed/tourweaver-og/1200/630"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-white">
        <FirebaseClientProvider>
          <GoogleAnalyticsTracking />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
