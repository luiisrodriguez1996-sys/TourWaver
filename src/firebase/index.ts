
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

/**
 * Initializes Firebase services and App Check.
 * App Check is configured with reCAPTCHA Enterprise for production-grade security.
 * This is the primary defense against automated bot attacks and API abuse.
 */
export function initializeFirebase() {
  if (!getApps().length) {
    const firebaseApp = initializeApp(firebaseConfig);

    // Initialize App Check only on the client side
    if (typeof window !== 'undefined') {
      const appCheckSiteKey = process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY || (firebaseConfig as any).appCheckSiteKey;
      
      if (appCheckSiteKey) {
        try {
          // Initialize App Check with reCAPTCHA Enterprise provider
          // This ensures that only requests from the genuine app can access Firebase services.
          initializeAppCheck(firebaseApp, {
            provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
            isTokenAutoRefreshEnabled: true,
          });
          console.log('Firebase App Check: Security shield active (reCAPTCHA Enterprise).');
        } catch (err) {
          // Prevent App Check initialization errors from blocking the entire app
          // but log them for developer visibility.
          console.error('Firebase App Check failed to initialize:', err);
        }
      } else {
        console.warn('App Check Site Key is missing. Bots might be able to abuse the APIs.');
      }
    }

    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
