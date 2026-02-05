"use client";

import React, { useEffect } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * Componente para inyectar manualmente los scripts de seguimiento de Google Analytics en el <head>.
 * Este enfoque se utiliza para seguir estrictamente la recomendación de Google de colocar el script
 * en la cabecera, permitiendo al mismo tiempo acceder a la configuración dinámica de Firestore
 * mediante el hook useFirestore (que requiere estar dentro del FirebaseClientProvider).
 */
function GoogleAnalyticsTracking() {
  const firestore = useFirestore();
  const siteConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'siteConfigurations', 'default');
  }, [firestore]);

  const { data: siteConfig } = useDoc(siteConfigRef);
  const gaId = siteConfig?.googleAnalyticsId;

  useEffect(() => {
    if (!gaId || gaId.trim() === '') return;

    // Evitar duplicados si el ID cambia o el componente se vuelve a renderizar
    const existingScript = document.getElementById('google-analytics-base');
    if (existingScript) return;

    // 1. Crear el script base (gtag.js)
    const script1 = document.createElement('script');
    script1.id = 'google-analytics-base';
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;

    // 2. Crear el script de configuración inline
    const script2 = document.createElement('script');
    script2.id = 'google-analytics-config';
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;

    // Insertar en el head del documento como indica Google
    document.head.appendChild(script1);
    document.head.appendChild(script2);

    return () => {
      // Limpieza opcional (GA suele persistir durante la sesión)
    };
  }, [gaId]);

  return null;
}

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
