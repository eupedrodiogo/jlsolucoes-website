import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/data/testimonials';

function StarRating({ rating }: { rating: number }) {
  return (
    // role="img" é necessário: aria-label é proibido em elementos genéricos
    // (uma <div> sem role). Com o role, o conjunto de estrelas vira uma
    // imagem única com nome acessível.
    <div
      className="flex justify-center gap-1 mb-4"
      role="img"
      aria-label={`Avaliação: ${rating} de 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={18}
          aria-hidden="true"
          className={i < rating ? 'text-[#e59c24] fill-[#e59c24]' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="depo" className="pt-20 lg:pt-28 bg-white flex flex-col border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-widest">
            Quem já viveu isso conta melhor
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
            A opinião de quem realmente importa.
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Não acredite só em nós — ouça de quem já confou na JL Soluções e hoje dorme tranquilo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              className="relative bg-white rounded-2xl p-8 pt-10 flex flex-col gap-4 shadow-lg border border-gray-100"
            >
              <div className="absolute top-[-1px] right-[-1px] bg-brand-teal text-white p-3 rounded-tr-2xl rounded-bl-2xl">
                <Quote size={28} className="fill-current" />
              </div>
              
              <StarRating rating={t.rating} />
              
              <blockquote className="text-gray-500 text-sm leading-relaxed flex-1 text-left">
                "{t.text}"
              </blockquote>
              
              <footer className="flex items-center justify-center gap-4 pt-4">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    width={160}
                    height={160}
                    loading="lazy"
                    className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-brand-teal ring-offset-2"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-brand-teal flex items-center justify-center text-white font-bold text-xl shadow-sm ring-2 ring-brand-teal ring-offset-2">
                    {t.name.charAt(0)}
                  </div>
                )}
                <cite className="text-brand-teal font-bold text-base not-italic">{t.name}</cite>
              </footer>
            </article>
          ))}
        </div>
      </div>

      <div className="w-full mt-auto">
        <div className="bg-brand-teal text-white py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-wide">
              Pagamentos em até 12x sem juros no cartão de crédito ou à vista no pix.
            </p>
          </div>
        </div>
        <div className="bg-white py-6 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-12 md:gap-24">
            <img src="/images/visa.webp" alt="Visa" width={240} height={78} loading="lazy" className="h-8 md:h-10 w-auto object-contain" />
            <img src="/images/mastercard.webp" alt="Mastercard" width={240} height={186} loading="lazy" className="h-10 md:h-12 w-auto object-contain" />
            <img src="/images/pix-106-1.webp" alt="Pix" width={240} height={85} loading="lazy" className="h-8 md:h-10 w-auto object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
