import { useScrollTop } from '@/hooks/useScrollTop';
import { ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';

export function ScrollToTop() {
  const visible = useScrollTop();

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Voltar ao topo"
      className={clsx(
        // O bottom soma --consent-height (0px quando não há banner na tela).
        'fixed bottom-[calc(var(--consent-height)+7rem)] lg:bottom-[calc(var(--consent-height)+5rem)] right-6 z-40 w-12 h-12 rounded-full border border-gray-200 bg-white text-brand-teal hover:text-white hover:bg-brand-teal hover:border-brand-teal flex items-center justify-center shadow-lg transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
      )}
    >
      <ChevronUp size={24} />
    </button>
  );
}
