import { WHATSAPP_URL } from '@/constants';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

/**
 * Botão flutuante WhatsApp — fixo no canto inferior direito.
 *
 * O `bottom` soma `--consent-height`, que vale 0px normalmente e passa a
 * refletir a altura do banner de consentimento enquanto ele estiver visível.
 */
export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Solicite um orçamento pelo WhatsApp"
      data-cta="whatsapp-flutuante"
      // bg-green-700, não green-500: texto branco em 14px semibold sobre
      // green-500 dá 2,21:1 (reprova o mínimo de 4,5:1). green-700 chega a 5:1.
      className="hidden lg:flex fixed bottom-[calc(var(--consent-height)+1.5rem)] right-6 z-50 h-14 pl-3.5 pr-5 bg-green-700 hover:bg-green-600 text-white rounded-full items-center gap-2 shadow-2xl shadow-green-700/40 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
    >
      <WhatsAppIcon className="w-7 h-7 shrink-0 fill-current" />
      <span className="whitespace-nowrap font-semibold text-sm">
        Solicite orçamento
      </span>
    </a>
  );
}
