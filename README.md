# 🔧 JL Soluções - Website & Portfolio

Website corporativo para **JL Soluções e Manutenções**, empresa especializada em serviços de manutenção industrial, elétrica e técnica na região de Pavuna, RJ.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-06B6D4?logo=tailwindcss)

---

## 🌟 Sobre o Projeto

A JL Soluções é uma empresa com **10+ anos de experiência** que atendeu mais de **500 clientes** com mais de **1000 projetos concluídos**. Este website apresenta:

- 📊 **Portfólio completo** de serviços
- 💬 **Depoimentos** de clientes satisfeitos
- 🎯 **Cases de sucesso** com imagens
- 📱 **Responsivo** e otimizado para mobile
- ⚡ **Performance otimizada** com imagens comprimidas
- 🔐 **Autenticação segura** via Google
- 📊 **Painel administrativo** para gerenciar conteúdo

---

## 🎯 Recursos Principais

### 🏠 Seções
- **Hero** — Landing page impactante
- **Sobre** — Missão, visão, valores e estatísticas
- **Serviços** — Catálogo de serviços com busca e modal detalhado
- **Portfólio** — Galeria de projetos realizados
- **Depoimentos** — Reviews de clientes
- **Admin** — Painel para gerenciar portfólio (imagens, descrições)

### ✨ Funcionalidades
- Consentimento LGPD com cookie banner
- WhatsApp floating button com mensagens pré-configuradas
- Link de contato com desenvolvedor
- Scroll suave e scroll-to-top
- Modo claro/escuro automático
- Otimização de imagens em build time

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologias |
|--------|------------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Styling** | Tailwind CSS 4 + Lucide Icons |
| **Routing** | React Router v7 |
| **Backend** | Firebase (Auth + Realtime DB) |
| **Deployment** | Firebase Hosting |
| **Otimização** | Sharp (processamento de imagens) |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Setup

```bash
# 1. Clone o repositório
git clone https://github.com/eupedrodiogo/jlsolucoes-website.git
cd jlsolucoes-website

# 2. Instale as dependências
npm install

# 3. Configure variáveis de ambiente
# Crie um arquivo .env.local com suas credenciais Firebase
cp .env.example .env.local

# 4. Rode o servidor de desenvolvimento
npm run dev

# 5. Abra em seu navegador
# http://localhost:5173
```

### Ambiente (`.env.local`)
```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento com HMR |
| `npm run build` | Build para produção (TypeScript + Vite) |
| `npm run preview` | Preview da build de produção localmente |
| `npm run lint` | Lint com oxlint |
| `npm run optimize:images` | Otimiza e reescreve referências de imagens |

---

## 📊 Performance

- ✅ **Lighthouse Score**: 90+ em desktop
- 📈 **Core Web Vitals**: Otimizado
- 🖼️ **Imagens**: Comprimidas com Sharp (~70% de redução)
- ⚡ **Bundle Size**: ~45KB gzipped

---

## 🚢 Deployment

O projeto está configurado para **Firebase Hosting**:

```bash
# 1. Build para produção
npm run build

# 2. Deploy (requer CLI do Firebase autenticado)
firebase deploy
```

Acesse: **[jlsolucoes.com.br](https://jlsolucoes.com.br)**

---

## 🔐 Segurança & Privacidade

- ✅ Autenticação via Google OAuth 2.0
- ✅ LGPD compliance com cookie banner
- ✅ Certificado SSL/TLS
- ✅ Nenhum dado sensível no frontend

---

## 📞 Contato & Suporte

**JL Soluções e Manutenções**
- 📱 WhatsApp: [(21) 99593-1720](https://wa.me/5521995931720)
- 📧 Email: contato@jlsolucoesemanutencoes.com.br
- 📍 Local: Brás Cubas - Pavuna, RJ
- 🌐 Website: [jlsolucoes.com.br](https://jlsolucoes.com.br)

---

## 👨‍💻 Desenvolvedor

Desenvolvido por **Pedro Diogo**
- 💬 Fale comigo: [(21) 97252-5151](https://wa.me/5521972525151?text=Olá%20Pedro%2C%20vi%20o%20site%20da%20JL%20Soluções%20e%20gostaria%20de%20conversar%20sobre%20o%20desenvolvimento%20de%20um%20site%20para%20o%20meu%20negócio)

---

## 📄 Licença

Proprietary © 2024-2026 JL Soluções e Manutenções. Todos os direitos reservados.

---

## 🙏 Agradecimentos

- Tailwind CSS pela excelente framework de styling
- Firebase pelo backend robusto
- React community pelos recursos e tooling

---

<div align="center">

**[⬆ Voltar ao topo](#-jl-soluções---website--portfolio)**

Feito com ❤️ por Pedro Diogo

</div>
