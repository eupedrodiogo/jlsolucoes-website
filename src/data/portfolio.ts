import type { PortfolioItem } from '@/types';

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: 'Manutenção Elétrica Industrial',
    category: 'Elétrica',
    image: '/images/electrician-switchboard.webp',
    description:
      'Manutenção preventiva e corretiva em painéis elétricos industriais, incluindo troca de quadros de luz, revisão de disjuntores e cabeamento estruturado para garantir a segurança e continuidade operacional.',
    gallery: [
      { type: 'image', src: '/images/electrician-switchboard.webp', alt: 'Troca de quadro de luz industrial' },
      { type: 'image', src: '/images/about-electrician.webp', alt: 'Eletricista realizando manutenção em painel' },
      { type: 'image', src: '/images/about-electrician-alt.webp', alt: 'Revisão de disjuntores e cabeamento' },
      { type: 'image', src: '/images/technician-fixing-cable-1.webp', alt: 'Técnico reparando cabeamento elétrico' },
    ],
  },
  {
    id: 2,
    title: 'Reforma Civil Predial',
    category: 'Civil',
    image: '/images/01-1.webp',
    description:
      'Reforma completa de áreas comuns e fachadas prediais, incluindo recuperação estrutural, pintura, impermeabilização e adequação de espaços conforme normas técnicas vigentes.',
    gallery: [
      { type: 'image', src: '/images/01-1.webp', alt: 'Reforma estrutural em andamento' },
      { type: 'image', src: '/images/03-1.webp', alt: 'Recuperação de alvenaria e reboco' },
      { type: 'image', src: '/images/04-1.webp', alt: 'Pintura e acabamento predial' },
      { type: 'image', src: '/images/05-1.webp', alt: 'Área reformada finalizada' },
    ],
  },
  {
    id: 3,
    title: 'Sistema de Refrigeração',
    category: 'Refrigeração',
    image: '/images/close-up-ventilation.webp',
    description:
      'Instalação e manutenção de sistemas de refrigeração industrial e comercial, incluindo chillers, fancoils, splits e sistemas VRF, com foco em eficiência energética e conforto térmico.',
    gallery: [
      { type: 'image', src: '/images/close-up-ventilation.webp', alt: 'Sistema de ventilação e refrigeração' },
      { type: 'image', src: '/images/close-up-ventilation-system-scaled-2-1-1024x683.webp', alt: 'Manutenção de chiller industrial' },
      { type: 'image', src: '/images/serv-hvac.webp', alt: 'Sistema HVAC em operação' },
      { type: 'image', src: '/images/close-up-ventilation-system-scaled-2-1-1536x1024.webp', alt: 'Condensadora e evaporadora em manutenção' },
    ],
  },
  {
    id: 4,
    title: 'Instalação Hidráulica',
    category: 'Hidráulica',
    image: '/images/02-1.webp',
    description:
      'Projetos e execução de instalações hidráulicas prediais e industriais, incluindo redes de água fria e quente, esgoto, recalque e sistemas de bombeamento com materiais de alta durabilidade.',
    gallery: [
      { type: 'image', src: '/images/02-1.webp', alt: 'Instalação de tubulação hidráulica' },
      { type: 'image', src: '/images/06-1.webp', alt: 'Rede hidráulica predial' },
      { type: 'image', src: '/images/09-1.webp', alt: 'Sistema de bombeamento e recalque' },
    ],
  },
  {
    id: 5,
    title: 'Manutenção Predial Completa',
    category: 'Predial',
    image: '/images/men-working.webp',
    description:
      'Serviço completo de manutenção predial preventiva e corretiva, abrangendo elétrica, hidráulica, civil e equipamentos, garantindo o pleno funcionamento do edifício e conformidade com normas.',
    gallery: [
      { type: 'image', src: '/images/men-working.webp', alt: 'Equipe em manutenção predial' },
      { type: 'image', src: '/images/men-working-with-equipment-full-shot-scaled-2-1-1024x683.webp', alt: 'Técnicos com equipamentos de manutenção' },
      { type: 'image', src: '/images/about-machinery.webp', alt: 'Manutenção de maquinário predial' },
      { type: 'image', src: '/images/07Troca-1.webp', alt: 'Troca de componentes prediais' },
      { type: 'image', src: '/images/12-1.webp', alt: 'Inspeção de instalações' },
    ],
  },
  {
    id: 6,
    title: 'Sistema Contra Incêndio',
    category: 'Incêndio',
    image: '/images/skid-bombas-incendio.webp',
    description:
      'Projeto, instalação e manutenção de sistemas de combate a incêndio, incluindo skid de bombas, hidrantes, sprinklers, alarmes e detecção, em conformidade com as normas do Corpo de Bombeiros.',
    gallery: [
      { type: 'image', src: '/images/skid-bombas-incendio.webp', alt: 'Skid de bombas contra incêndio' },
      { type: 'image', src: '/images/skid-bombas-incendio-01-1-768x512.webp', alt: 'Casa de bombas e tubulação de incêndio' },
      { type: 'image', src: '/images/serv-alarme.webp', alt: 'Sistema de alarme e detecção de incêndio' },
      { type: 'image', src: '/images/serv-spda.webp', alt: 'Sistema SPDA e proteção contra descargas' },
    ],
  },
];
