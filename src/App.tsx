import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { PainPoints } from '@/components/sections/PainPoints';
import { Services } from '@/components/sections/Services';
import { About } from '@/components/sections/About';
import { CTAFinal } from '@/components/sections/CTAFinal';
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { ConsentBanner } from '@/components/ui/ConsentBanner';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Lazy load para seções menos críticas (melhora o LCP)
const Testimonials = lazy(() =>
  import('@/components/sections/Testimonials').then((m) => ({ default: m.Testimonials })),
);
const Portfolio = lazy(() =>
  import('@/components/sections/Portfolio').then((m) => ({ default: m.Portfolio })),
);
const FAQ = lazy(() =>
  import('@/components/sections/FAQ').then((m) => ({ default: m.FAQ })),
);
const AdminPage = lazy(() =>
  import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })),
);

function SectionFallback() {
  return (
    <div className="py-20 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-teal/30 border-t-brand-teal rounded-full animate-spin" />
    </div>
  );
}

function LandingPage() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">
      <Navbar />
      <main>
        {/* Ato 1 — O Gancho: identifica a dor */}
        <Hero />

        {/* Ato 2 — A Dor: aprofunda o problema */}
        <PainPoints />

        {/* Ato 3 — A Solução: o que fazemos */}
        <Services />

        {/* Ato 4 — A Prova: quem somos, por que confiar */}
        <About />

        {/* Ato 5 — Resultados: trabalhos entregues */}
        <Suspense fallback={<SectionFallback />}>
          <Portfolio />
        </Suspense>

        {/* Ato 6 — Validação Social: depoimentos */}
        <Suspense fallback={<SectionFallback />}>
          <Testimonials />
        </Suspense>

        {/* Ato 7 — A Chamada: CTA de encerramento */}
        <CTAFinal />

        {/* FAQ mantido antes do footer */}
        <Suspense fallback={<SectionFallback />}>
          <FAQ />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
      <ConsentBanner />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<SectionFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
