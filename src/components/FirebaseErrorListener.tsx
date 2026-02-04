'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { usePathname } from 'next/navigation';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It ensures that permission errors don't cause a generic "client-side exception" crash
 * by allowing routes to handle them gracefully.
 */
export function FirebaseErrorListener() {
  const [error, setError] = useState<FirestorePermissionError | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Si estamos en la vista pública del tour o en login, dejamos que el componente local 
      // maneje el error para mostrar una interfaz controlada en lugar de crashear la app.
      if (pathname?.startsWith('/tour/') || pathname === '/login') {
        console.warn('Controlled permission error suppressed in global listener:', error.message);
        return;
      }
      setError(error);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [pathname]);

  if (error) {
    // Solo lanzamos el error si no estamos en una ruta con manejo local elegante.
    throw error;
  }

  return null;
}
