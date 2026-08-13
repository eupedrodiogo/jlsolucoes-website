import { Shield, Clock, Award, Users } from 'lucide-react';
import { WHATSAPP_URL } from '@/constants';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

const HIGHLIGHTS = [
  { icon: Shield, label: 'Segurança Certificada' },
  { icon: Clock, label: 'Atendimento Ágil' },
  { icon: Award, label: '+10 Anos de Experiência' },
  { icon: Users, label: '+500 Clientes Atendidos' },
];

export function CTAFinal() {
  return (
    <section className="relative overflow-hidden bg-brand-teal">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }}
      />

      {/* Large decorative circle */}
      <div className="absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute -right-16 -top-16 w-[350px] h-[350px] rounded-full border border-white/10 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        {/* Label */}
        <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/20">
          Pronto para resolver?
        </span>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
          Sua empresa merece uma manutenção{' '}
          <span className="relative">
            <span className="relative z-10">que realmente funciona.</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-white/20 -skew-x-2 rounded" />
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-white/75 text-base mb-10 max-w-xl mx-auto leading-relaxed">
          Fale agora com nossa equipe. Diagnóstico inicial gratuito, sem compromisso.
          Em poucos minutos você terá um orçamento claro e objetivo.
        </p>

        {/* CTA Button */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="cta-final"
          className="inline-flex items-center gap-3 bg-white text-brand-teal font-black text-sm uppercase tracking-wider px-10 py-5 rounded-full shadow-2xl hover:shadow-white/20 hover:-translate-y-1 hover:scale-105 transition-all duration-300"
        >
          <WhatsAppIcon className="w-5 h-5 fill-brand-teal" />
          Falar com a JL Soluções agora
        </a>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 lg:gap-10">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
