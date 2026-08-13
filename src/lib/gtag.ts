declare global {
  interface Window {
    dataLayer?: IArguments[];
  }
}

/**
 * Empurra comandos para a fila do gtag.
 *
 * O gtag.js lê a fila esperando o objeto `arguments` cru, exatamente como no
 * snippet oficial — por isso a implementação não usa rest params. O alias
 * tipado abaixo existe só para dar uma assinatura utilizável nas chamadas.
 *
 * Chamadas feitas antes do script carregar não se perdem: ficam na fila e são
 * processadas quando ele chega.
 */
function gtagRaw(): void {
  // eslint-disable-next-line prefer-rest-params
  (window.dataLayer ??= []).push(arguments);
}

export const gtag = gtagRaw as (...args: unknown[]) => void;
