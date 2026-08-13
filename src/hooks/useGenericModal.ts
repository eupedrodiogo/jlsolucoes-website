import { useState, useCallback, useEffect } from 'react';

interface UseGenericModalReturn<T> {
  selected: T | null;
  openModal: (item: T) => void;
  closeModal: () => void;
}

/**
 * useGenericModal — hook genérico para gerenciar qualquer modal
 * Inclui bloqueio de scroll e fechamento por ESC
 */
export function useGenericModal<T>(): UseGenericModalReturn<T> {
  const [selected, setSelected] = useState<T | null>(null);

  const openModal = useCallback((item: T) => {
    setSelected(item);
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
