// ============================================================
// Constantes globais do projeto — altere aqui, reflete em todo o site
// ============================================================

export const WHATSAPP_NUMBER = '5521995931720';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const EMAIL = 'jlsolucoesemmanutencao@gmail.com';
export const PHONE_DISPLAY = '(21) 99593-1720';
export const ADDRESS = 'Brás Cubas - Pavuna, RJ';
export const INSTAGRAM_URL = 'https://www.instagram.com';
export const FACEBOOK_URL = 'https://www.facebook.com';
export const DEVELOPER_WHATSAPP_URL = `https://wa.me/5521972525151?text=${encodeURIComponent(
  'Olá Pedro, vi o site da JL Soluções e gostaria de conversar sobre o desenvolvimento de um site para o meu negócio.'
)}`;

export const NAV_ITEMS = [
  { label: 'Sobre Nós', href: '#sobre' },
  { label: 'Serviços', href: '#serv' },
  { label: 'Depoimentos', href: '#depo' },
  { label: 'Portfólio', href: '#port' },
] as const;

export type NavHref = (typeof NAV_ITEMS)[number]['href'];

export function buildWhatsappLink(message: string): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

// ============================================================
// Admin — emails autorizados a acessar o painel administrativo
// Adicione aqui os emails Google que terão acesso ao /admin
// ============================================================
export const ADMIN_EMAILS: string[] = [
  'jlsolucoesemmanutencao@gmail.com',
  'pedrodiogo.suporte@gmail.com',
];
