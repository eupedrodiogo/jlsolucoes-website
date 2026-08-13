import { OPTIMIZED_IMAGE_BASENAMES } from '@/data/optimizedImages';

/**
 * Prefere a versão .webp de uma imagem local, quando ela existe.
 *
 * O código já aponta direto para .webp, mas documentos gravados no Firestore
 * antes da otimização ainda guardam o caminho com a extensão antiga. Em vez de
 * migrar o banco, a troca acontece na leitura.
 *
 * URLs externas (Firebase Storage, por exemplo) passam intactas.
 */
export function preferWebp<T extends string | undefined | null>(url: T): T {
  if (!url) return url;

  const match = /^\/images\/(.+)\.(?:jpe?g|png)$/i.exec(url);
  if (!match) return url;

  const basename = match[1];
  return (
    OPTIMIZED_IMAGE_BASENAMES.has(basename) ? `/images/${basename}.webp` : url
  ) as T;
}
