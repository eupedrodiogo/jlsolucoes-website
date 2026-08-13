import { useState } from 'react';
import { Expand } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import type { PortfolioItemWithFirestoreId } from '@/hooks/usePortfolio';
import { useGenericModal } from '@/hooks/useGenericModal';
import { PortfolioLightbox } from '@/components/ui/PortfolioLightbox';

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const { selected, openModal, closeModal } = useGenericModal<PortfolioItemWithFirestoreId>();
  const { items, loading } = usePortfolio();

  const categories = ['Todos', ...Array.from(new Set(items.map((i) => i.category)))];

  const filtered =
    activeCategory === 'Todos'
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <section id="port" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-yellow/20 text-yellow-800 text-xs font-bold uppercase tracking-widest">
            Resultados Reais
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Veja com seus próprios olhos.
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Cada projeto aqui representa um problema resolvido, uma operação restaurada e um cliente que voltou a trabalhar sem preocupações.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-brand-teal text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-brand-teal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Instrução de uso, mais evidente no mobile onde não há hover para indicar que a imagem é clicável */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal text-white text-sm font-bold shadow-sm sm:bg-gray-100 sm:text-gray-500 sm:font-medium sm:shadow-none">
            <Expand size={16} className="shrink-0" />
            <span>Toque em um projeto para ver fotos e vídeos completos do serviço</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand-teal/30 border-t-brand-teal rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => openModal(item)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 border border-gray-100 transition-all duration-300 cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Ver galeria: ${item.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(item);
                  }
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Ícone sempre visível no mobile indicando que a imagem é clicável */}
                  <span className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white sm:hidden">
                    <Expand size={16} />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-teal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-end justify-between p-4">
                    <span className="text-white font-bold text-sm">{item.title}</span>
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                      <Expand size={16} />
                    </span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-gray-900 font-semibold text-sm">{item.title}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox com ID do Firestore para curtidas/comentários */}
      {selected && (
        <PortfolioLightbox
          item={selected}
          firestoreId={selected.firestoreId}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
