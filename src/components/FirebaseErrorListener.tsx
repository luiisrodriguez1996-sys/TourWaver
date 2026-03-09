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
      // Supressing errors on public or auth routes to prevent full app crashes
      // if data fetching for optional sections fails.
      const suppressPaths = ['/tour/', '/login', '/'];
      const shouldSuppress = suppressPaths.some(p => pathname === p || pathname?.startsWith('/tour/'));

      if (shouldSuppress) {
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
    // Solo lanzamos el error si no estamos en una ruta con manejo local elegante o supresión.
    throw error;
  }

  return null;
}