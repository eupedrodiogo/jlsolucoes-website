import { Zap, Clock, TrendingDown } from 'lucide-react';

const PAINS = [
  {
    icon: Zap,
    title: 'Falhas elétricas sem aviso',
    description:
      'Um curto-circuito inesperado pode parar toda a linha de produção, gerando horas de inatividade e custos de emergência que ninguém planejou.',
    stat: '37%',
    statLabel: 'das falhas industriais são elétricas',
  },
  {
    icon: Clock,
    title: 'Tempo parado = dinheiro perdido',
    description:
      'Cada hora de manutenção corretiva não planejada pode custar dezenas de milhares de reais em produção parada, horas extras e logística emergencial.',
    stat: '3×',
    statLabel: 'mais caro que a manutenção preventiva',
  },
  {
    icon: TrendingDown,
    title: 'Equipamentos envelhecendo rápido',
    description:
      'Sem um plano de manutenção, a vida útil dos equipamentos cai drasticamente — e a conta de substituição chega muito antes do esperado.',
    stat: '40%',
    statLabel: 'de redução na vida útil sem manutenção',
  },
];

export function PainPoints() {
  return (
    <section id="dor" className="bg-gray-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-widest border border-red-100">
            O problema que todo gestor conhece
          </span>
          <h2 className="text-3xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
            Quando a manutenção falha,{' '}
            <span className="text-brand-teal">
              tudo para.
            </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Ignorar a manutenção preventiva não economiza dinheiro — ela adia um custo maior.
            E esse custo sempre chega na pior hora.
          </p>
        </div>

        {/* Pain cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PAINS.map(({ icon: Icon, title, description, stat, statLabel }) => (
            <div
              key={title}
              className="group bg-white border border-gray-100 rounded-2xl p-8 hover:border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                <Icon size={22} className="text-red-500" />
              </div>

              {/* Stat highlight */}
              <div className="mb-4">
                <span className="text-4xl font-black text-gray-900 tabular-nums">{stat}</span>
                <p className="text-gray-600 text-xs mt-1 uppercase tracking-wide">{statLabel}</p>
              </div>

              <h3 className="text-gray-900 font-bold text-lg mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Bridge to next section */}
        <div className="text-center mt-14">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-brand-teal/50" />
            <span className="text-brand-teal text-sm font-bold uppercase tracking-widest">
              Existe uma forma melhor
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-brand-teal/50 to-transparent" />
          </div>
        </div>

      </div>
    </section>
  );
}
