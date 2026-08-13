import { useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { ServiceModal } from '@/components/ui/ServiceModal';
import { useModal } from '@/hooks/useModal';
import { useAllServicesImages } from '@/hooks/useSiteSettings';

export function Services() {
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');
  const { selected, openModal, closeModal } = useModal();
  const servicesImages = useAllServicesImages();

  // Show only first 6 by default; "ver todos" reveals the rest
  const VISIBLE_COUNT = 6;
  const isSearching = search.trim().length > 0;

  const filtered = SERVICES.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()),
  );

  const displayedServices = isSearching
    ? filtered
    : showAll
      ? SERVICES
      : SERVICES.slice(0, VISIBLE_COUNT);

  return (
    <section id="serv" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — narrativo + busca */}
        <div className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-yellow/20 text-yellow-800 text-xs font-bold uppercase tracking-widest">
              Nossa solução
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-5">
              Cada problema tem{' '}
              <span className="text-brand-teal">um especialista</span> pronto para resolver.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Da elétrica industrial às bombas hidráulicas, cobrimos todas as frentes de
              manutenção que a sua operação precisa para nunca parar.
            </p>
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <div className="relative shadow-sm rounded-2xl">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar serviço..."
                aria-label="Buscar serviço"
                className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Limpar busca"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-teal transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid de cards */}
        {displayedServices.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl max-w-lg mx-auto border border-gray-100">
            <p className="text-gray-600 text-lg">
              Nenhum serviço encontrado para{' '}
              <span className="text-brand-teal font-semibold">"{search}"</span>
            </p>
            <button
              onClick={() => setSearch('')}
              className="mt-4 text-brand-teal underline underline-offset-4 text-sm hover:text-brand-teal-light transition-colors cursor-pointer"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {displayedServices.map((service) => (
              <div
                key={service.id}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="overflow-hidden bg-gray-100">
                  <img
                    src={servicesImages[service.id] ?? service.image}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        '/images/electrician-switchboard.webp';
                    }}
                    alt={service.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-gray-900 font-bold text-base mb-2 group-hover:text-brand-teal transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
                    {service.description}
                  </p>
                  <button
                    onClick={() => openModal(service)}
                    className="mt-4 flex items-center justify-center gap-2 bg-brand-yellow/10 text-brand-teal text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl hover:bg-brand-yellow hover:text-brand-teal hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    Saiba Mais
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* "Ver todos os serviços" — apenas expande a lista */}
        {!isSearching && !showAll && SERVICES.length > VISIBLE_COUNT && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 border-2 border-brand-teal text-brand-teal font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-brand-teal hover:text-white transition-all duration-300 cursor-pointer"
            >
              Ver todos os serviços
            </button>
          </div>
        )}
      </div>

      {selected && <ServiceModal service={selected} onClose={closeModal} />}
    </section>
  );
}
