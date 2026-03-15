import type { Metadata } from "next";
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { GoogleAnalyticsTracking } from '@/components/GoogleAnalyticsTracking';
import { GoogleSearchConsoleVerification } from '@/components/GoogleSearchConsoleVerification';

/**
 * Configuración de metadatos SEO para buscadores y redes sociales (WhatsApp, Twitter, FB).
 */
export const metadata: Metadata = {
  title: {
    default: "Vistar | Tours Virtuales 360°",
    template: "%s | Vistar"
  },
  description: "Plataforma profesional para la creación y exhibición de tours virtuales 360°. Eleva tus listados inmobiliarios con experiencias inmersivas premium.",
  keywords: ["tour virtual", "360", "inmobiliaria", "real estate", "vistas panorámicas", "propiedades de lujo", "Vistar", "broker inmobiliario"],
  authors: [{ name: "Vistar" }],
  creator: "Vistar",
  metadataBase: new URL('https://vistar-360.com'), // Cambiar por el dominio real en producción
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2329ABE2%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><circle cx=%2212%22 cy=%2212%22 r=%2210%22/><line x1=%222%22 y1=%2212%22 x2=%2222%22 y2=%2212%22/><path d=%22M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z%22/></svg>',
  },
  openGraph: {
    title: "Vistar | Tours Virtuales 360° Profesionales",
    description: "Muestra tus propiedades como nunca antes con experiencias inmersivas 360° de alta fidelidad.",
    url: "https://vistar-360.com",
    siteName: "Vistar",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x630/29ABE2/white?text=Vistar+360",
        width: 1200,
        height: 630,
        alt: "Vistar Brand Identity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vistar | Tours Virtuales 360°",
    description: "La mejor solución de visualización inmersiva para el mercado inmobiliario.",
    images: ["https://placehold.co/1200x630/29ABE2/white?text=Vistar+360"],
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
          <GoogleSearchConsoleVerification />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
