/**
 * GA4 + acompanhamento de conversões do Google Ads.
 *
 * Substitui o `firebase/analytics`, que era só um wrapper em cima do gtag e
 * custava ~46 KB gzip de chunks. O gtag direto atende a mesma propriedade GA4
 * e é o que o Google Ads exige para registrar conversão.
 *
 * O script só é injetado depois do `load`, em idle — ou na hora, se o
 * visitante clicar num CTA antes disso. Os sinais de consentimento entram na
 * fila antes de tudo (ver src/lib/consent.ts).
 */
import { gtag } from '@/lib/gtag';
import { applyConsentDefaults } from '@/lib/consent';

// ─── Configuração ────────────────────────────────────────────
//
// GA4 já estava configurado no projeto Firebase.
export const GA4_MEASUREMENT_ID = 'G-X7PC9EFXH9';

// ⚠️  PREENCHER com os dados do Google Ads.
//
// Onde achar, no painel do Google Ads:
//   Ferramentas → Medição → Conversões → (criar ou abrir uma ação de conversão)
//   → "Configurar tag" → "Instalar a tag manualmente".
//
// Lá aparecem dois valores:
//   • ID da conversão   → AW-123456789          (vai em GOOGLE_ADS_ID)
//   • Rótulo (label)    → AbC-D_efGhIjKlMnOp    (vai em CONVERSION_LABELS)
//
// Enquanto estiverem vazios, os eventos do GA4 continuam sendo enviados
// normalmente e só o disparo de conversão do Ads fica desligado.
export const GOOGLE_ADS_ID = '';

export const CONVERSION_LABELS: Record<ConversionType, string> = {
  // Formato: `${GOOGLE_ADS_ID}/${label}` — ex.: 'AW-123456789/AbC-D_efGhIjKlMnOp'
  whatsapp: '',
  email: '',
};

export type ConversionType = 'whatsapp' | 'email';

// O estado de consentimento precisa estar na fila ANTES de qualquer `config`
// ou evento. Rodar no import garante essa ordem, já que `loadAnalytics()` só
// é chamado depois (em idle).
applyConsentDefaults();

let scriptInjected = false;

/**
 * Injeta o gtag.js. Chamadas anteriores ao carregamento não se perdem: elas
 * ficam na fila do dataLayer e são processadas quando o script chega.
 */
export function loadAnalytics(): void {
  if (scriptInjected || typeof document === 'undefined') return;
  scriptInjected = true;

  gtag('js', new Date());
  gtag('config', GA4_MEASUREMENT_ID);
  if (GOOGLE_ADS_ID) gtag('config', GOOGLE_ADS_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

// ─── Conversões ───────────────────────────────────────────────

/**
 * Registra um contato como conversão: evento `generate_lead` no GA4 e, se o
 * rótulo estiver configurado, a conversão correspondente no Google Ads.
 *
 * `origem` identifica de onde partiu o clique (hero, cta-final, rodapé…), o
 * que permite ver no GA4 qual CTA converte melhor.
 */
export function trackConversion(type: ConversionType, origem: string): void {
  // Se o visitante clicou antes do idle, o script ainda não foi injetado.
  loadAnalytics();

  gtag('event', 'generate_lead', {
    method: type,
    origem,
    // O Ads usa `value`/`currency` para ROAS. Sem valor definido por lead,
    // deixamos de fora — melhor não reportar número inventado.
  });

  const sendTo = CONVERSION_LABELS[type];
  if (sendTo) {
    gtag('event', 'conversion', { send_to: sendTo });
  }
}

// ─── Captura dos CTAs ─────────────────────────────────────────

function origemDoLink(link: HTMLAnchorElement): string {
  const explicito = link.closest<HTMLElement>('[data-cta]')?.dataset.cta;
  if (explicito) return explicito;

  const secao = link.closest('section')?.id;
  if (secao) return secao;

  if (link.closest('footer')) return 'rodape';
  if (link.closest('nav, header')) return 'navbar';
  return 'outro';
}

/**
 * Um único listener delegado cobre todos os links de contato do site — hoje
 * são 11 espalhados por 7 componentes, e qualquer novo passa a ser rastreado
 * sem precisar lembrar de instrumentar.
 *
 * Use `data-no-track` num link para deixá-lo de fora (o link do
 * desenvolvedor no rodapé aponta para o mesmo número e não é um lead).
 */
export function trackContactClicks(): void {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest('a[href]');
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.dataset.noTrack !== undefined) return;

      const href = link.getAttribute('href') ?? '';
      const type: ConversionType | null = href.includes('wa.me')
        ? 'whatsapp'
        : href.startsWith('mailto:')
          ? 'email'
          : null;

      if (type) trackConversion(type, origemDoLink(link));
    },
    { capture: true },
  );
}
