import { useCallback, useEffect, useRef, useState } from 'react';
import { Cookie } from 'lucide-react';
import {
  readStoredConsent,
  setConsent,
  subscribeConsent,
  type ConsentDecision,
} from '@/lib/consent';

/**
 * Banner de consentimento (LGPD + Consent Mode v2).
 *
 * Dois cuidados que não são óbvios:
 *
 * 1. Só monta em idle, depois da primeira pintura. Se aparecesse junto com o
 *    hero, poderia virar o elemento de LCP e derrubar a nota de performance.
 *    Como é `position: fixed`, entrar depois não desloca nada (CLS = 0).
 *
 * 2. "Aceitar" e "Recusar" têm o mesmo tamanho e o mesmo peso tipográfico.
 *    Esconder ou apagar a recusa é dark pattern e invalida o consentimento —
 *    ele precisa ser uma escolha livre.
 *
 * 3. A altura real do card vai para a variável CSS `--consent-height`, que os
 *    botões flutuantes somam ao seu `bottom`. Chutar um valor fixo não
 *    funciona: no mobile o texto quebra e os botões empilham, e o card passa
 *    de 150 px para mais de 300 px.
 */
export function ConsentBanner() {
  const [decision, setDecision] = useState<ConsentDecision | null | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDecision(readStoredConsent());
    return subscribeConsent(setDecision);
  }, []);

  useEffect(() => {
    const show = () => setMounted(true);

    // `'requestIdleCallback' in window` estreitaria `window` para never no
    // ramo negativo, já que a lib.dom declara a propriedade como sempre
    // presente. A checagem por typeof evita isso.
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(show, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(show, 800);
    return () => window.clearTimeout(id);
  }, []);

  const open = mounted && decision === null;
  const observerRef = useRef<ResizeObserver | null>(null);

  /**
   * Publica a altura ocupada pelo banner. Um ResizeObserver mantém o valor
   * correto quando o card muda de altura (rotação de tela, fonte maior).
   */
  const measureRef = useCallback((node: HTMLDivElement | null) => {
    const root = document.documentElement;

    // Sem desconectar, o observer ainda dispara quando o card sai do DOM —
    // com offsetHeight 0 — e deixava 24px residuais na variável.
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (!node) {
      root.style.setProperty('--consent-height', '0px');
      return;
    }

    const publish = () => {
      // +24px: o padding do wrapper mais uma folga entre o card e os botões.
      root.style.setProperty('--consent-height', `${node.offsetHeight + 24}px`);
    };
    publish();

    const observer = new ResizeObserver(publish);
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  useEffect(() => {
    // Garante a limpeza quando o banner some (o callback ref com node=null já
    // cobre o caso normal; isto protege o desmonte do componente inteiro).
    return () => document.documentElement.style.setProperty('--consent-height', '0px');
  }, []);

  if (!open) return null;

  const decide = (value: ConsentDecision) => () => setConsent(value);

  // O wrapper ocupa a largura toda da tela mas é invisível: sem
  // pointer-events-none ele engoliria cliques nos botões flutuantes que ficam
  // ao lado do card.
  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-desc"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4 animate-fade-in pointer-events-none"
    >
      <div
        ref={measureRef}
        className="pointer-events-auto mx-auto max-w-3xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3 mb-3">
          <span className="shrink-0 w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
            <Cookie size={18} aria-hidden="true" />
          </span>
          <div>
            <h2 id="consent-title" className="text-gray-900 font-bold text-base">
              Este site usa cookies
            </h2>
            <p id="consent-desc" className="text-gray-700 text-sm leading-relaxed mt-1">
              Usamos cookies para medir o desempenho do site e das nossas campanhas
              de anúncios. Você pode recusar — o site continua funcionando
              normalmente, e nada é gravado no seu navegador.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:justify-end">
          <button
            type="button"
            onClick={decide('denied')}
            className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-800 text-sm font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={decide('granted')}
            className="px-6 py-2.5 rounded-full bg-brand-teal text-white text-sm font-bold uppercase tracking-wider hover:bg-brand-teal-light transition-colors cursor-pointer"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
