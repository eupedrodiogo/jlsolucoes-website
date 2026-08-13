import { createContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { getAuthInstance, authModule } from '@/lib/firebase';
import { ADMIN_EMAILS } from '@/constants';

export interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Sobe o Firebase Auth. Chamado pelo useAuth de quem realmente precisa. */
  enableAuth: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * O Auth não sobe no mount: só quando algum componente chama `useAuth()`.
 *
 * Na landing page nada usa auth durante a primeira renderização — só o
 * ProtectedRoute (/admin) e o PortfolioLightbox (aberto por clique). Assim o
 * visitante comum nunca baixa o chunk do firebase/auth.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email ?? '') : false;

  const enableAuth = useCallback(() => setEnabled(true), []);

  useEffect(() => {
    if (!enabled) return;

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [auth, m] = await Promise.all([getAuthInstance(), authModule()]);
      if (cancelled) return;
      unsubscribe = m.onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
    })().catch((err) => {
      console.error('Falha ao inicializar o Firebase Auth:', err);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [enabled]);

  const signInWithGoogle = useCallback(async () => {
    const [auth, m] = await Promise.all([getAuthInstance(), authModule()]);
    await m.signInWithPopup(auth, new m.GoogleAuthProvider());
  }, []);

  const signOut = useCallback(async () => {
    const [auth, m] = await Promise.all([getAuthInstance(), authModule()]);
    await m.signOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, signInWithGoogle, signOut, enableAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
