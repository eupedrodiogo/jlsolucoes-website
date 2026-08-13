/**
 * Consent Mode v2 do Google.
 *
 * O modo é o "avançado": o gtag carrega sempre, mas com todos os sinais
 * negados por padrão. Sem consentimento ele não grava cookie nem envia
 * identificador — manda apenas pings anônimos, que o Google usa para
 * *modelar* conversões. Comparado a simplesmente não carregar nada, isso
 * preserva boa parte da medição das campanhas sem rastrear quem recusou.
 *
 * A ordem importa: `consent default` precisa entrar na fila do dataLayer
 * ANTES de qualquer `config` ou evento. Por isso `applyConsentDefaults()` roda
 * no import do módulo, e o `loadAnalytics()` só dispara os `config` depois.
 */

export type ConsentDecision = 'granted' | 'denied';

const STORAGE_KEY = 'jl_consent_v1';

/** Sinais exigidos pelo Consent Mode v2. */
const AD_SIGNALS = ['ad_storage', 'ad_user_data', 'ad_personalization'] as const;
const ANALYTICS_SIGNALS = ['analytics_storage'] as const;

import { gtag } from '@/lib/gtag';

function signalsFor(decision: ConsentDecision) {
  const value = decision;
  return {
    ...Object.fromEntries(AD_SIGNALS.map((s) => [s, value])),
    ...Object.fromEntries(ANALYTICS_SIGNALS.map((s) => [s, value])),
  };
}

export function readStoredConsent(): ConsentDecision | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'granted' || stored === 'denied' ? stored : null;
  } catch {
    // localStorage pode estar bloqueado (modo restrito / iframe)
    return null;
  }
}

let applied = false;

/**
 * Publica o estado inicial de consentimento. Chamado no import, antes de
 * qualquer `config`.
 */
export function applyConsentDefaults(): void {
  if (applied || typeof window === 'undefined') return;
  applied = true;

  gtag('consent', 'default', {
    ...signalsFor('denied'),
    // Cookies estritamente necessários não dependem de escolha do usuário.
    security_storage: 'granted',
    // Dá meio segundo para o `update` chegar antes de qualquer disparo,
    // evitando enviar um hit negado quando a escolha já está salva.
    wait_for_update: 500,
  });

  const stored = readStoredConsent();
  if (stored) gtag('consent', 'update', signalsFor(stored));
}

type Listener = (decision: ConsentDecision | null) => void;
const listeners = new Set<Listener>();

export function subscribeConsent(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Registra a escolha do visitante e avisa o gtag na hora. */
export function setConsent(decision: ConsentDecision): void {
  try {
    localStorage.setItem(STORAGE_KEY, decision);
  } catch {
    // Sem persistência o banner reaparece na próxima visita — aceitável.
  }

  gtag('consent', 'update', signalsFor(decision));
  listeners.forEach((listener) => listener(decision));
}

/** Reabre a escolha (usado pelo link "Preferências de cookies" no rodapé). */
export function resetConsent(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignora */
  }
  listeners.forEach((listener) => listener(null));
}
