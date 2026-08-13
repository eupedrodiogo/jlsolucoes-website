import { WHATSAPP_URL } from '@/constants';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { ChevronDown } from 'lucide-react';
import { useHeroImage } from '@/hooks/useSiteSettings';

export function Hero() {
  const heroImage = useHeroImage();
  const handleScrollDown = () => {
    const next = document.getElementById('dor');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToAbout = () => {
    const el = document.getElementById('sobre');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex" style={{ minHeight: '500px' }}>
      {/* Left Panel: fundo azul teal + card branco centralizado */}
      <div className="relative z-10 w-full md:w-[47%] lg:w-[45%] bg-brand-teal flex items-center flex-shrink-0">
        <div className="w-full px-8 sm:px-12 lg:px-16 py-10 lg:py-14">
          {/* White Card */}
          <div className="bg-white rounded-2xl px-8 sm:px-12 py-8 sm:py-10 shadow-2xl">
            {/* Pain hook label */}
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-widest">
              Isso está te custando dinheiro
            </span>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black leading-tight text-gray-900 mb-4">
              Chega de paradas inesperadas que travam a sua operação.
            </h1>

            <p className="text-base sm:text-lg text-gray-500 mb-6 leading-relaxed">
              Manutenção corretiva custa até <strong className="text-brand-teal">3× mais</strong> do
              que a preventiva. A <strong className="text-brand-teal">JL Soluções</strong> elimina esse risco antes que ele vire prejuízo.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="hero-orcamento"
                className="inline-flex items-center justify-center gap-2 bg-brand-teal text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full hover:bg-brand-teal-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <WhatsAppIcon className="w-5 h-5 fill-current" />
                Solicitar Orçamento Grátis
              </a>

              <button
                onClick={handleScrollToAbout}
                className="inline-flex items-center justify-center text-brand-teal text-sm font-semibold uppercase tracking-wider hover:text-brand-teal-light transition-colors cursor-pointer"
              >
                Conheça nossa história →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Electrician Photo
          <img> em vez de background-image: o navegador descobre a URL no
          parse do HTML (com o preload do index.html) em vez de esperar o CSS,
          e o fetchPriority tira o LCP da fila de prioridade baixa. */}
      <div className="hidden md:block flex-1 relative overflow-hidden">
        <img
          src={heroImage}
          alt="Eletricista trabalhando no quadro elétrico"
          width={1600}
          height={1068}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay suave */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-brand-teal/20 to-transparent" />
      </div>

      {/* Scroll Indicator — só a partir de md, onde fica sobre a foto.
          Abaixo disso o painel da foto some, o card branco ocupa a largura
          toda e o indicador ficava branco sobre branco: invisível.
          O drop-shadow garante leitura sobre qualquer região da foto. */}
      <button
        onClick={handleScrollDown}
        aria-label="Rolar para próxima seção"
        className="hidden md:flex absolute bottom-6 right-1/4 z-10 flex-col items-center gap-1 text-white transition-colors group cursor-pointer [text-shadow:0_1px_3px_rgb(0_0_0_/_0.6)] drop-shadow-md"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest">Saiba mais</span>
        <ChevronDown
          size={22}
          className="animate-bounce group-hover:text-brand-yellow transition-colors"
        />
      </button>
    </section>
  );
}
