import { useState, useEffect, useCallback } from 'react';

/**
 * useScrollSpy — detecta qual seção está visível e retorna seu href
 * Usado pelo Navbar para destacar o item ativo no menu
 */
export function useScrollSpy(sectionIds: readonly string[]): string {
  const [activeId, setActiveId] = useState<string>('');

  const handleScroll = useCallback(() => {
    let current = '';
    for (const id of sectionIds) {
      const el = document.getElementById(id.replace('#', ''));
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) current = id;
      }
    }
    setActiveId(current);
  }, [sectionIds]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return activeId;
}
