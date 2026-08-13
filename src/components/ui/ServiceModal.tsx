import { X, Phone } from 'lucide-react';
import type { Service } from '@/types';
import { buildWhatsappLink } from '@/constants';

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const waLink = buildWhatsappLink(`Olá! Gostaria de saber mais sobre: ${service.title}`);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes: ${service.title}`}
    >
      <div
        className="relative bg-white border border-gray-100 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/10 text-gray-800 hover:bg-brand-yellow hover:rotate-90 transition-all duration-300"
        >
          <X size={18} />
        </button>

        {/* Imagem */}
        <div className="relative md:w-2/5 h-52 md:h-auto shrink-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white hidden md:block opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white md:hidden opacity-20" />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-700 bg-brand-yellow/20 px-3 py-1.5 rounded-full">
              Detalhes do Serviço
            </span>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-teal bg-brand-teal/10 px-3 py-1.5 rounded-full hover:bg-brand-teal hover:text-white transition-all"
            >
              <Phone size={12} />
              Falar com Especialista
            </a>
          </div>

          <h3 className="text-brand-teal text-3xl font-black mb-4">{service.title}</h3>
          <p className="text-gray-600 leading-relaxed mb-8">{service.description}</p>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-brand-yellow text-brand-teal font-bold text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-[#e5b800] hover:-translate-y-1 transition-all shadow-md w-max"
          >
            Falar com Especialista
          </a>
        </div>
      </div>
    </div>
  );
}
