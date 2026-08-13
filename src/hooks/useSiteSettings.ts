import { useState, useEffect } from 'react';
import {
  subscribeHeroSettings,
  subscribeAboutSettings,
  subscribeServiceImage,
  fetchHeroSettings,
  fetchAboutSettings,
  fetchServiceImages,
} from '@/services/siteSettingsService';
import { SERVICES } from '@/data/services';
import { preferWebp } from '@/lib/imageUrl';

// ─── Fallbacks (imagens originais estáticas) ─────────────────

const HERO_FALLBACK =
  '/images/side-view-of-handsome-bearded-electrician-repairing-electrical-box-and-using-screwdriver-in-corridor-1-1.webp';
const ABOUT_IMAGE1_FALLBACK = '/images/about-machinery.webp';
// about-electrician-2.jpg nunca existiu em public/images — o fallback dava 404
// em todo carregamento. O arquivo correto é about-electrician.
const ABOUT_IMAGE2_FALLBACK = '/images/about-electrician.webp';

/**
 * `realtime` liga o onSnapshot do Firestore. A landing page usa leitura única
 * (padrão): o WebChannel de vida longa deixa uma requisição pendente que
 * estoura em ERR_TIMED_OUT no console quando a página é encerrada, e o
 * visitante não ganha nada com tempo real. O painel admin passa `true` para
 * ver o resultado do upload na hora.
 */

// ─── Hook: Hero ───────────────────────────────────────────────

export function useHeroImage(realtime = false): string {
  const [url, setUrl] = useState(HERO_FALLBACK);

  useEffect(() => {
    if (realtime) {
      return subscribeHeroSettings(
        (data) => { if (data.backgroundImage) setUrl(preferWebp(data.backgroundImage)); },
        () => setUrl(HERO_FALLBACK),
      );
    }

    let cancelled = false;
    fetchHeroSettings()
      .then((data) => {
        if (!cancelled && data.backgroundImage) setUrl(preferWebp(data.backgroundImage));
      })
      .catch(() => { if (!cancelled) setUrl(HERO_FALLBACK); });
    return () => { cancelled = true; };
  }, [realtime]);

  return url;
}

// ─── Hook: About ──────────────────────────────────────────────

export interface AboutImages {
  image1: string;
  image2: string;
}

export function useAboutImages(realtime = false): AboutImages {
  const [images, setImages] = useState<AboutImages>({
    image1: ABOUT_IMAGE1_FALLBACK,
    image2: ABOUT_IMAGE2_FALLBACK,
  });

  useEffect(() => {
    const apply = (data: Partial<AboutImages>) =>
      setImages({
        image1: preferWebp(data.image1) || ABOUT_IMAGE1_FALLBACK,
        image2: preferWebp(data.image2) || ABOUT_IMAGE2_FALLBACK,
      });

    if (realtime) {
      return subscribeAboutSettings(apply, () => {});
    }

    let cancelled = false;
    fetchAboutSettings()
      .then((data) => { if (!cancelled) apply(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [realtime]);

  return images;
}

// ─── Hook: Service Image (individual) ────────────────────────

export function useServiceImage(serviceId: number, fallback: string): string {
  const [url, setUrl] = useState(fallback);

  useEffect(() => {
    return subscribeServiceImage(
      serviceId,
      (firestoreUrl) => { setUrl(preferWebp(firestoreUrl) ?? fallback); },
      () => setUrl(fallback),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  return url;
}

// ─── Hook: Todas as imagens dos serviços ─────────────────────
/** Retorna um map serviceId → URL (já com fallback) */
export function useAllServicesImages(realtime = false): Record<number, string> {
  const initial: Record<number, string> = {};
  SERVICES.forEach((s) => { initial[s.id] = s.image; });

  const [map, setMap] = useState<Record<number, string>>(initial);

  useEffect(() => {
    if (realtime) {
      const unsubs = SERVICES.map((s) =>
        subscribeServiceImage(
          s.id,
          (url) => {
            setMap((prev) => ({ ...prev, [s.id]: preferWebp(url) ?? s.image }));
          },
          () => {},
        ),
      );
      return () => unsubs.forEach((u) => u());
    }

    // Uma leitura da coleção inteira, em vez de um listener por serviço.
    let cancelled = false;
    fetchServiceImages()
      .then((images) => {
        if (cancelled) return;
        setMap(() => {
          const next: Record<number, string> = {};
          SERVICES.forEach((s) => {
            next[s.id] = preferWebp(images[String(s.id)]) || s.image;
          });
          return next;
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [realtime]);

  return map;
}
