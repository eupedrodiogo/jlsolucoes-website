import { useState, useCallback, useEffect } from 'react';
import type { Service } from '@/types';

interface UseModalReturn {
  selected: Service | null;
  openModal: (service: Service) => void;
  closeModal: () => void;
}

/**
 * useModal — gerencia o estado do modal de serviços
 * Inclui bloqueio de scroll e fechamento por ESC
 */
export function useModal(): UseModalReturn {
  const [selected, setSelected] = useState<Service | null>(null);

  const openModal = useCallback((service: Service) => {
    setSelected(service);
  }, []);

  const closeModal = useCallback(() => {
    setSelected(null);
  }, []);

  // Bloqueia scroll do body quando modal está aberto
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selected]);

  // Fecha com ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (selected) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected, closeModal]);

  return { selected, openModal, closeModal };
}
