import { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import type { AuthContextValue } from '@/contexts/AuthContext';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  // Consumir o hook é o sinal de que o Auth é necessário — só aí o chunk
  // do firebase/auth é baixado.
  const { enableAuth } = context;
  useEffect(() => { enableAuth(); }, [enableAuth]);

  return context;
}
