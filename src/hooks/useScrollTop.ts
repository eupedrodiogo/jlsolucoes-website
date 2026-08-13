import { useState, useEffect } from 'react';

/**
 * useScrollTop — controla visibilidade do botão "voltar ao topo"
 */
export function useScrollTop(threshold = 400): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return visible;
}
