import { useEffect } from 'react';

const STAGGER_MS = 90;
const MAX_STAGGER_STEPS = 5;

/**
 * useScrollReveal — anima a entrada dos blocos de cada seção ao rolar a página.
 *
 * Marca com `data-reveal` os filhos diretos do container de cada <section> e,
 * dentro de grids, cada card (com atraso escalonado). O que já está na tela
 * no carregamento não é escondido, evitando "piscar". Seções carregadas via
 * lazy() são pegas por um MutationObserver.
 *
 * As classes só existem depois que o JS roda, então sem JS o conteúdo continua
 * visível. `prefers-reduced-motion` é tratado no CSS.
 */
export function useScrollReveal(rootSelector = 'main') {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    const track = (el: HTMLElement, delayMs = 0) => {
      if (el.hasAttribute('data-reveal')) return;
      el.setAttribute('data-reveal', '');
      if (delayMs) el.style.setProperty('--reveal-delay', `${delayMs}ms`);
      // Já visível ao carregar: não anima, só ignora.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add('is-visible');
        return;
      }
      io.observe(el);
    };

    const scan = () => {
      root.querySelectorAll<HTMLElement>('section').forEach((section) => {
        const host = section.querySelector<HTMLElement>('[class*="max-w"]');
        if (!host) return;
        Array.from(host.children).forEach((child) => {
          if (!(child instanceof HTMLElement)) return;
          const isGrid = /\bgrid\b/.test(child.className) && child.children.length > 1;
          if (isGrid) {
            Array.from(child.children).forEach((card, i) => {
              if (card instanceof HTMLElement) {
                track(card, (i % (MAX_STAGGER_STEPS + 1)) * STAGGER_MS);
              }
            });
          } else {
            track(child);
          }
        });
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [rootSelector]);
}
