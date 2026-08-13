/** Largura máxima gravada no Storage — cobre o hero em telas 2x. */
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 0.82;

export interface PreparedUpload {
  file: File;
  /** Extensão a usar no caminho do Storage ('webp' quando houve conversão). */
  extension: string;
}

/**
 * Redimensiona e converte imagens para WebP antes do upload.
 *
 * As imagens estáticas do repositório são otimizadas no build, mas tudo que
 * entra pelo painel admin ia direto para o Storage do jeito que saiu da
 * câmera — um JPG de 4 MB derruba o LCP de novo e ninguém percebe. Aqui a
 * compressão acontece no navegador, antes de subir.
 *
 * Vídeos, SVGs e qualquer falha na conversão passam intactos.
 */
export async function prepareUpload(file: File): Promise<PreparedUpload> {
  const originalExtension = file.name.split('.').pop()?.toLowerCase() || 'bin';

  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return { file, extension: originalExtension };
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_WIDTH / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      bitmap.close();
      return { file, extension: originalExtension };
    }

    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY),
    );

    // Se o WebP ficou maior (acontece com imagens já bem comprimidas e
    // pequenas), o original é a melhor escolha.
    if (!blob || blob.size >= file.size) {
      return { file, extension: originalExtension };
    }

    const name = `${file.name.replace(/\.[^.]+$/, '')}.webp`;
    return {
      file: new File([blob], name, { type: 'image/webp' }),
      extension: 'webp',
    };
  } catch (err) {
    console.warn('Não foi possível comprimir a imagem; enviando original.', err);
    return { file, extension: originalExtension };
  }
}
