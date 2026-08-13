import { Globe, Eye, Bell, Check, Shield, Clock, Award, Users, Wrench, ThumbsUp } from 'lucide-react';
import { useAboutImages } from '@/hooks/useSiteSettings';

const STATS = [
  { value: '10+', label: 'Anos de Experiência' },
  { value: '500+', label: 'Clientes Atendidos' },
  { value: '1000+', label: 'Projetos Concluídos' },
  { value: '98%', label: 'Satisfação dos Clientes' },
];

const FEATURES = [
  { icon: Shield, title: 'Segurança Garantida', description: 'Seguimos todas as normas técnicas e de segurança vigentes.' },
  { icon: Clock, title: 'Pontualidade', description: 'Comprometidos com os prazos acordados em cada projeto.' },
  { icon: Award, title: 'Qualidade Certificada', description: 'Profissionais qualificados e certificados em suas especialidades.' },
  { icon: Users, title: 'Equipe Especializada', description: 'Time multidisciplinar para todas as demandas de manutenção.' },
  { icon: Wrench, title: 'Equipamentos Modernos', description: 'Utilizamos ferramentas e tecnologias de ponta nos serviços.' },
  { icon: ThumbsUp, title: 'Suporte Contínuo', description: 'Atendimento ágil e suporte pós-serviço para nossos clientes.' },
];

const VALORES = [
  'Ética e transparência',
  'Respeito ao cliente',
  'Qualidade',
  'Sustentabilidade',
  'Comprometimento',
  'Inovação',
];

export function About() {
  const aboutImages = useAboutImages();
  return (
    <section id="sobre" className="bg-white">

      {/* ── MAIN: Imagens + Missão/Visão/Valores ─────────────────── */}
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT — Overlapping images */}
            <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] select-none">
              {/* Background image: green machinery — top-right, larger */}
              <div className="absolute right-0 top-0 w-[72%] h-[78%] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={aboutImages.image1}
                  alt="Equipamento industrial"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Foreground image: electrician — bottom-left, smaller, on top */}
              <div className="absolute left-0 bottom-0 w-[58%] h-[62%] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white">
                <img
                  src={aboutImages.image2}
                  alt="Eletricista trabalhando"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>

            {/* RIGHT — Content */}
            <div>
              {/* Narrative label */}
              <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-widest">
                Quem está por trás da solução
              </span>

              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">
                Nossa História
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                A JL Soluções e Manutenções nasceu da convicção de que manutenção industrial
                não deve ser um problema — deve ser uma vantagem competitiva para quem nos escolhe.
              </p>

              {/* Missão */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={18} className="text-brand-teal shrink-0" />
                  <h3 className="font-bold text-brand-teal text-base">Missão</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Nossa missão é assegurar ao mercado de Engenharia, serviços com elevado padrão de
                  qualidade, considerando o fundamental cumprimento das normas de Qualidade, Segurança
                  e Meio Ambiente. Inovando continuamente por meio de investimentos em tecnologia e
                  qualificação profissional, visando o aperfeiçoamento constante dos nossos trabalhos
                  e a satisfação de nossos clientes.
                </p>
              </div>

              {/* Visão */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={18} className="text-brand-teal shrink-0" />
                  <h3 className="font-bold text-brand-teal text-base">Visão</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ser uma empresa líder em referência no setor da Engenharia, atendendo as demandas com
                  uma estrutura competente e otimizada que nos permita enfrentar novos desafios e
                  continuar a superar as expectativas de nossos clientes, possibilitando assim um
                  crescimento sólido e a consequente expansão de nossas atividades.
                </p>
              </div>

              {/* Valores */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bell size={18} className="text-brand-teal shrink-0" />
                  <h3 className="font-bold text-brand-teal text-base">Valores</h3>
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-2.5">
                  {VALORES.map((valor) => (
                    <div key={valor} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-brand-teal flex items-center justify-center shrink-0">
                        <Check size={9} className="text-white stroke-[3]" />
                      </div>
                      <span className="text-gray-600 text-sm">{valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── STATS BAND ──────────────────────────────────────────── */}
      <div className="bg-brand-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center px-6 lg:px-10 py-4 ${i > 0 ? 'border-l border-white/10' : ''}`}
              >
                <div className="text-4xl lg:text-5xl font-black text-white mb-1 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-white/90 text-sm font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DIFERENCIAIS ─────────────────────────────────────────── */}
      <div className="bg-gray-50 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-teal mb-2">
              Por que nos escolher especificamente?
            </p>
            <h3 className="text-3xl lg:text-4xl font-black text-gray-900">
              Nossos Diferenciais
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-brand-teal/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Numeração é marca d'água decorativa: o título do card já
                    carrega a informação. aria-hidden a tira da árvore de
                    acessibilidade, onde ela reprovaria no contraste (1,83:1)
                    sem que mudar a cor trouxesse ganho real de leitura. */}
                <span
                  aria-hidden="true"
                  className="absolute top-4 right-5 text-7xl font-black text-brand-teal/[0.35] group-hover:text-brand-teal/[0.50] transition-colors duration-300 select-none leading-none tabular-nums pointer-events-none"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-brand-teal/10 group-hover:bg-brand-teal flex items-center justify-center mb-5 transition-colors duration-300">
                    <Icon size={20} className="text-brand-teal group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="text-gray-900 font-bold text-base mb-2 group-hover:text-brand-teal transition-colors">
                    {title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
