import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Inlina o CSS do build dentro do index.html.
 *
 * O <link rel="stylesheet"> é render-blocking: o navegador precisa buscar o
 * HTML, achar o link, abrir outra requisição e só então pintar. Numa conexão
 * 4G lenta isso custava ~320 ms no caminho crítico. Com ~10 KB gzip de CSS,
 * embutir sai mais barato que uma ida e volta na rede.
 *
 * A contrapartida é que visitantes recorrentes rebaixam o CSS junto com o
 * HTML em vez de pegá-lo do cache. Para uma landing page de anúncios, onde a
 * maioria dos acessos é primeira visita, o primeiro carregamento é o que vale.
 */
function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    enforce: 'post',
    apply: 'build',
    generateBundle(_options, bundle) {
      const htmlFiles = Object.values(bundle).filter(
        (asset) => asset.type === 'asset' && asset.fileName.endsWith('.html'),
      );

      for (const html of htmlFiles) {
        if (html.type !== 'asset') continue;
        let source = html.source.toString();

        for (const [fileName, asset] of Object.entries(bundle)) {
          if (asset.type !== 'asset' || !fileName.endsWith('.css')) continue;

          const linkPattern = new RegExp(
            `<link[^>]+href="[^"]*${escapeRegExp(fileName)}"[^>]*>`,
          );
          if (!linkPattern.test(source)) continue;

          source = source.replace(
            linkPattern,
            `<style>${asset.source.toString()}</style>`,
          );
          delete bundle[fileName];
        }

        html.source = source;
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineCss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // O Lighthouse cobra source maps para o JS principal ("Mapas de origem
    // ausentes no JavaScript principal grande").
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-router')) return 'router';
          if (id.includes('/react-dom/') || id.includes('/react/')) return 'react';
        },
      },
    },
  },
  server: {
    host: true,
  },
});
