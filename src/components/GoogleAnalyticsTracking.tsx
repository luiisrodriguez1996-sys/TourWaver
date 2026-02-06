
"use client";

import { useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * Componente para inyectar manualmente los scripts de seguimiento de Google Analytics.
 * Se separa del layout principal para permitir que este sea un Server Component.
 */
export function GoogleAnalyticsTracking() {
  const firestore = useFirestore();
  const siteConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'siteConfigurations', 'default');
  }, [firestore]);

  const { data: siteConfig } = useDoc(siteConfigRef);
  const gaId = siteConfig?.googleAnalyticsId;

  useEffect(() => {
    if (!gaId || gaId.trim() === '') return;

    // Evitar duplicados
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

    // Insertar en el head
    document.head.appendChild(script1);
    document.head.appendChild(script2);
  }, [gaId]);

  return null;
}
