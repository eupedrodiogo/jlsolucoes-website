import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ChevronRight, ExternalLink } from 'lucide-react';
import { NAV_ITEMS, WHATSAPP_URL, EMAIL, PHONE_DISPLAY, ADDRESS, INSTAGRAM_URL, FACEBOOK_URL, DEVELOPER_WHATSAPP_URL } from '@/constants';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { resetConsent } from '@/lib/consent';

const PAYMENT_BADGES = [
  { src: '/images/pix-106-1.webp', alt: 'Pix', width: 240, height: 85 },
  { src: '/images/mastercard.webp', alt: 'Mastercard', width: 240, height: 186 },
  { src: '/images/visa.webp', alt: 'Visa', width: 240, height: 78 },
];

export function Footer() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-950 border-t border-gray-800/80 text-gray-300 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main Grid: 4 Strategic Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-16 border-b border-gray-800/80">
          
          {/* Col 1: Brand & Social */}
          <div className="space-y-5">
            <img
              src="/images/logo-jl-branca-1.webp"
              alt="JL Soluções e Manutenções"
              width={560}
              height={142}
              className="h-14 w-auto object-contain"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Transformando projetos em realidade com máxima qualidade, segurança e conformidade técnica. Atendimento ágil e garantido.
            </p>
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-3">
                Siga nossas redes
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-300 shadow-sm"
                >
                  <svg viewBox="0 0 320 512" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                  </svg>
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#E4405F] hover:border-[#E4405F] transition-all duration-300 shadow-sm"
                >
                  <svg viewBox="0 0 448 512" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                  </svg>
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 shadow-sm"
                >
                  <WhatsAppIcon size={16} className="fill-current" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-yellow" />
              Navegação
            </h3>
            <ul className="space-y-3" role="list">
              {NAV_ITEMS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-gray-400 text-sm hover:text-brand-yellow transition-colors"
                  >
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all" />
                    <span>{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact & Location */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-yellow" />
              Atendimento
            </h3>
            <ul className="space-y-4 text-sm text-gray-400" role="list">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-yellow shrink-0 mt-0.5" />
                <span className="leading-tight">{ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-yellow shrink-0" />
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors font-medium">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-yellow shrink-0" />
                <a href={`mailto:${EMAIL}`} className="hover:text-brand-yellow transition-colors break-all">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3 pt-1 text-xs text-gray-400">
                <Clock size={16} className="text-brand-yellow shrink-0 mt-0.5" />
                <span>Seg a Sáb: 08h às 18h</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Fast Action & Payment */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-yellow" />
              Pagamento & Orçamento
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Aceitamos diversas formas de pagamento para facilitar a sua contratação.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {PAYMENT_BADGES.map((badge) => (
                <div key={badge.alt} className="bg-gray-900 border border-gray-800 rounded-lg p-2 flex items-center justify-center">
                  <img
                    src={badge.src}
                    alt={badge.alt}
                    width={badge.width}
                    height={badge.height}
                    loading="lazy"
                    className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-yellow text-gray-950 font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 hover:shadow-lg hover:shadow-brand-yellow/10 transition-all duration-300"
            >
              <WhatsAppIcon size={16} className="fill-current" />
              Solicitar Orçamento Rápido
            </a>
          </div>
        </div>

        {/* Bottom Bar: Developer Signature & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Developer Credit Box - Strategic & Harmonious */}
          <a
            href={DEVELOPER_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-no-track
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900 p-4 border border-gray-800 hover:border-brand-yellow/40 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-brand-yellow/5"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 group-hover:bg-brand-yellow/20 transition-all duration-300">
                🚀
              </div>
              <div>
                <p className="text-xs text-gray-400">
                  Desenvolvido por <strong className="text-white font-semibold group-hover:text-brand-yellow transition-colors">Pedro Diogo</strong> — Engenheiro de Produto
                </p>
                <p className="text-xs text-brand-yellow font-bold flex items-center gap-1 mt-0.5 group-hover:underline">
                  <span>Clique aqui e crie seu site comigo!</span>
                  <ExternalLink size={12} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </p>
              </div>
            </div>
          </a>

          {/* Copyright Notice */}
          <div
            className="text-center md:text-right text-gray-400 text-xs select-none space-y-1"
            onDoubleClick={() => navigate('/admin')}
          >
            <p>© {year} JL Soluções e Manutenções. Todos os direitos reservados.</p>
            {/* gray-600 sobre gray-950 dá 2,67:1 — bem abaixo do mínimo de 4,5:1 */}
            <p className="text-[10px] text-gray-400">Qualidade, Segurança e Compromisso Profissional</p>
            {/* O consentimento precisa ser revogável a qualquer momento. */}
            <button
              type="button"
              onClick={resetConsent}
              className="text-[10px] text-gray-400 underline underline-offset-2 hover:text-brand-yellow transition-colors cursor-pointer"
            >
              Preferências de cookies
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
