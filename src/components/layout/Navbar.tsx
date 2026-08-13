import { useState, useEffect } from 'react';
import { Home, Wrench, LayoutGrid, MoreHorizontal, X, MapPin, Phone, Mail } from 'lucide-react';
import { clsx } from 'clsx';
import { NAV_ITEMS, WHATSAPP_URL, EMAIL, PHONE_DISPLAY, ADDRESS } from '@/constants';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

const SECTION_HREFS = NAV_ITEMS.map((i) => i.href);

// Itens fixos na barra inferior mobile; o resto fica atrás do botão "Mais"
const BOTTOM_BAR_ITEMS = [NAV_ITEMS[1], NAV_ITEMS[3]];
const MORE_ITEMS = [NAV_ITEMS[0], NAV_ITEMS[2]];

const BOTTOM_ICONS: Record<string, typeof Wrench> = {
  '#serv': Wrench,
  '#port': LayoutGrid,
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(SECTION_HREFS);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setIsOpen(false);
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="bg-white relative z-50">
        {/* Top Info Bar (Desktop) */}
        <div className="hidden lg:block border-b border-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-shrink-0"
            >
              <img
                src="/images/logoJL-1.webp"
                alt="JL Soluções e Manutenções"
                width={560}
                height={142}
                className="h-14 w-auto object-contain"
              />
            </a>

            {/* Info Blocks */}
            <div className="flex items-center gap-8 xl:gap-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-teal shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Endereço</p>
                  <p className="text-gray-700 text-sm font-medium">{ADDRESS}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-teal shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Número</p>
                  <a href={WHATSAPP_URL} className="text-gray-700 text-sm font-medium hover:text-brand-teal transition-colors">
                    {PHONE_DISPLAY}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-teal shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">e-mail</p>
                  <a href={`mailto:${EMAIL}`} className="text-gray-700 text-sm font-medium hover:text-brand-teal transition-colors">
                    {EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <nav
          className={clsx(
            'transition-all duration-300 bg-white',
            scrolled ? 'fixed top-0 left-0 right-0 shadow-md py-3' : 'py-4 relative'
          )}
          role="navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center relative">

              {/* Mobile Logo (only visible on mobile/tablet) */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="lg:hidden flex-shrink-0"
              >
                <img
                  src="/images/logoJL-1.webp"
                  alt="JL Soluções e Manutenções"
                  width={560}
                  height={142}
                  className="h-10 w-auto object-contain"
                />
              </a>

              {/* Desktop Links */}
              <div className="hidden lg:flex items-center gap-8">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNav(item.href)}
                    className={clsx(
                      'text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer',
                      activeId === item.href
                        ? 'text-brand-teal'
                        : 'text-brand-teal/80 hover:text-brand-teal',
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Desktop CTA Button */}
              <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="navbar-desktop"
                  className="flex items-center gap-2 bg-brand-teal text-white text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-full hover:bg-brand-teal-light transition-all shadow-md hover:shadow-lg"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current" />
                  Fale Conosco
                </a>
              </div>

            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Bar (WhatsApp CTA + Navigation) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Solicite um orçamento pelo WhatsApp"
          data-cta="whatsapp-mobile-bar"
          className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm font-bold uppercase tracking-wider py-3 transition-colors border-b border-white/15"
        >
          <WhatsAppIcon className="w-5 h-5 fill-current" />
          Solicite orçamento
        </a>

        <nav
          role="navigation"
          aria-label="Navegação principal"
          className="border-t border-gray-100"
        >
        <div className="flex items-stretch justify-around">
          <button
            onClick={() => handleNav('#top')}
            className="flex flex-col items-center gap-1 py-2.5 flex-1 cursor-pointer"
          >
            <Home
              size={22}
              className={activeId === '' ? 'text-brand-teal' : 'text-gray-500'}
            />
            <span
              className={clsx(
                'text-[10px] font-bold uppercase tracking-wide',
                activeId === '' ? 'text-brand-teal' : 'text-gray-500',
              )}
            >
              Início
            </span>
          </button>

          {BOTTOM_BAR_ITEMS.map((item) => {
            const Icon = BOTTOM_ICONS[item.href] ?? Wrench;
            return (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className="flex flex-col items-center gap-1 py-2.5 flex-1 cursor-pointer"
              >
                <Icon size={22} className={activeId === item.href ? 'text-brand-teal' : 'text-gray-500'} />
                <span
                  className={clsx(
                    'text-[10px] font-bold uppercase tracking-wide',
                    activeId === item.href ? 'text-brand-teal' : 'text-gray-500',
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Mais opções"
            className="flex flex-col items-center gap-1 py-2.5 flex-1 cursor-pointer"
          >
            <MoreHorizontal size={22} className="text-gray-500" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Mais</span>
          </button>
        </div>
        </nav>
      </div>

      {/* "Mais" Bottom Sheet */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl pb-[calc(env(safe-area-inset-bottom)+16px)] animate-[slideUp_0.25s_ease-out]">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2.5" />
              <span className="text-sm font-bold text-brand-teal uppercase tracking-wider">Mais opções</span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Fechar"
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-2 py-2">
              {MORE_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className="block w-full text-left px-4 py-3 text-sm font-bold text-brand-teal uppercase tracking-wider hover:bg-gray-50 rounded-lg transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="px-5 pt-2 pb-1">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="navbar-mobile-sheet"
                className="flex items-center justify-center gap-2 bg-brand-teal text-white text-sm font-bold uppercase tracking-wider px-5 py-3 rounded-lg"
              >
                <WhatsAppIcon className="w-5 h-5 fill-current" />
                Fale Conosco
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
