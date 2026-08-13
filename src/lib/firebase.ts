import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyBO-CC5UNg7AHDKDxTGcTFCz8Db9HTb7L4",
  authDomain: "jlsolucoes-prod.firebaseapp.com",
  projectId: "jlsolucoes-prod",
  storageBucket: "jlsolucoes-prod.firebasestorage.app",
  messagingSenderId: "448549130543",
  appId: "1:448549130543:web:80b09972e38389524051da",
  measurementId: "G-X7PC9EFXH9",
};

/**
 * Todo o SDK do Firebase é carregado sob demanda via `import()` dinâmico.
 *
 * Antes, este módulo inicializava app + analytics + auth + firestore + storage
 * no topo, o que jogava ~200 KB gzip de Firebase no bundle inicial da landing
 * page — mesmo para quem nunca abre /admin. Agora cada serviço vira um chunk
 * separado, buscado só quando alguém realmente usa.
 *
 * As promises são memoizadas, então chamadas concorrentes compartilham a mesma
 * inicialização.
 */

let appPromise: Promise<FirebaseApp> | undefined;
let authPromise: Promise<Auth> | undefined;
let dbPromise: Promise<Firestore> | undefined;
let storagePromise: Promise<FirebaseStorage> | undefined;

export function getFirebaseApp(): Promise<FirebaseApp> {
  appPromise ??= import('firebase/app').then((m) => m.initializeApp(firebaseConfig));
  return appPromise;
}

/** Acesso ao módulo do Firestore (doc, onSnapshot, query…) sob demanda. */
export function firestoreModule() {
  return import('firebase/firestore');
}

/** Acesso ao módulo de Auth sob demanda. */
export function authModule() {
  return import('firebase/auth');
}

export function getDb(): Promise<Firestore> {
  dbPromise ??= Promise.all([getFirebaseApp(), firestoreModule()]).then(([app, m]) =>
    m.getFirestore(app),
  );
  return dbPromise;
}

export function getAuthInstance(): Promise<Auth> {
  authPromise ??= Promise.all([getFirebaseApp(), authModule()]).then(([app, m]) =>
    m.getAuth(app),
  );
  return authPromise;
}

export function getStorageInstance(): Promise<FirebaseStorage> {
  storagePromise ??= Promise.all([getFirebaseApp(), import('firebase/storage')]).then(
    ([app, m]) => m.getStorage(app),
  );
  return storagePromise;
}

/**
 * Adapta uma inicialização assíncrona à API síncrona de unsubscribe que os
 * hooks já esperam: devolve na hora uma função de cleanup que cancela a
 * subscrição, tenha ela chegado a ser criada ou não.
 */
export function lazySubscribe(
  start: () => Promise<() => void>,
  onError?: (err: unknown) => void,
): () => void {
  let unsubscribe: (() => void) | undefined;
  let cancelled = false;

  start()
    .then((fn) => {
      if (cancelled) fn();
      else unsubscribe = fn;
    })
    .catch((err) => {
      console.error('Falha ao iniciar subscrição do Firestore:', err);
      onError?.(err);
    });

  return () => {
    cancelled = true;
    unsubscribe?.();
  };
}
