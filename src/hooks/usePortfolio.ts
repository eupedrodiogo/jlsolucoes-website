import { useState, useEffect } from 'react';
import { subscribePortfolio, fetchPortfolio } from '@/services/portfolioService';
import type { FirestorePortfolioItem } from '@/services/portfolioService';
import { PORTFOLIO_ITEMS } from '@/data/portfolio';
import { preferWebp } from '@/lib/imageUrl';
import type { PortfolioItem } from '@/types';

/** Item enriquecido com o ID string original do Firestore */
export interface PortfolioItemWithFirestoreId extends PortfolioItem {
  firestoreId: string;
}

interface UsePortfolioReturn {
  items: PortfolioItemWithFirestoreId[];
  loading: boolean;
  isFromFirestore: boolean;
}

/**
 * usePortfolio — lê do Firestore em tempo real, com fallback para dados estáticos.
 * Retorna `firestoreId` em cada item para uso nas interações (curtidas/comentários).
 */
export function usePortfolio(realtime = false): UsePortfolioReturn {
  const [firestoreItems, setFirestoreItems] = useState<FirestorePortfolioItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (realtime) {
      return subscribePortfolio(
        (items) => {
          setFirestoreItems(items);
          setLoading(false);
        },
        () => setLoading(false),
      );
    }

    // Leitura única na landing page — ver nota em siteSettingsService.
    let cancelled = false;
    fetchPortfolio()
      .then((items) => {
        if (cancelled) return;
        setFirestoreItems(items);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [realtime]);

  // Se Firestore tem dados, usa eles; senão, fallback para estáticos
  if (!loading && firestoreItems && firestoreItems.length > 0) {
    const mapped: PortfolioItemWithFirestoreId[] = firestoreItems.map((item) => ({
      id: Number(item.id) || Math.random(),
      firestoreId: item.id, // <-- ID string original do Firestore
      title: item.title,
      category: item.category,
      // Itens gravados antes da conversão guardam /images/*.jpg
      image: preferWebp(item.image),
      description: item.description,
      gallery: (item.gallery ?? []).map((media) => ({
        ...media,
        src: preferWebp(media.src),
      })),
    }));
    return { items: mapped, loading: false, isFromFirestore: true };
  }

  if (loading) {
    return { items: [], loading: true, isFromFirestore: false };
  }

  // Fallback para dados estáticos — usa id numérico como string
  const staticMapped: PortfolioItemWithFirestoreId[] = PORTFOLIO_ITEMS.map((item) => ({
    ...item,
    firestoreId: String(item.id),
  }));
  return { items: staticMapped, loading: false, isFromFirestore: false };
}
