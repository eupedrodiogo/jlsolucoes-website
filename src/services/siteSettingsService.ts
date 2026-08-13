import type { Unsubscribe } from 'firebase/firestore';
import { getDb, firestoreModule, lazySubscribe } from '@/lib/firebase';
import { listCollectionRest } from '@/lib/firestoreRest';

// ─── Tipos ───────────────────────────────────────────────────

export interface HeroSettings {
  backgroundImage: string;
}

export interface AboutSettings {
  image1: string;
  image2: string;
}

export interface ServicesImages {
  [serviceId: number]: string; // serviceId → URL
}

// ─── Subscriptions ───────────────────────────────────────────

export function subscribeHeroSettings(
  callback: (data: Partial<HeroSettings>) => void,
  onError?: (err: unknown) => void,
): Unsubscribe {
  return lazySubscribe(async () => {
    const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
    return fs.onSnapshot(
      fs.doc(db, 'siteSettings', 'heroSection'),
      (snap) => callback(snap.exists() ? (snap.data() as HeroSettings) : {}),
      (err) => { console.error('subscribeHeroSettings:', err); onError?.(err); },
    );
  }, onError);
}

export function subscribeAboutSettings(
  callback: (data: Partial<AboutSettings>) => void,
  onError?: (err: unknown) => void,
): Unsubscribe {
  return lazySubscribe(async () => {
    const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
    return fs.onSnapshot(
      fs.doc(db, 'siteSettings', 'aboutSection'),
      (snap) => callback(snap.exists() ? (snap.data() as AboutSettings) : {}),
      (err) => { console.error('subscribeAboutSettings:', err); onError?.(err); },
    );
  }, onError);
}

export function subscribeServiceImage(
  serviceId: number,
  callback: (url: string | null) => void,
  onError?: (err: unknown) => void,
): Unsubscribe {
  return lazySubscribe(async () => {
    const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
    return fs.onSnapshot(
      fs.doc(fs.collection(db, 'siteSettings', 'servicesImages', 'items'), String(serviceId)),
      (snap) => callback(snap.exists() ? (snap.data()?.image as string) : null),
      (err) => { console.error('subscribeServiceImage:', err); onError?.(err); },
    );
  }, onError);
}

// ─── Leituras únicas ─────────────────────────────────────────
//
// A landing page usa estas em vez das subscriptions. O onSnapshot abre um
// WebChannel de vida longa com o Firestore; quando o navegador (ou o
// Lighthouse) encerra a página, a requisição pendente estoura em
// ERR_TIMED_OUT e vai parar no console. Conteúdo que muda uma vez por mês
// não precisa de tempo real para o visitante.

/**
 * Lê a coleção `siteSettings` inteira numa requisição só, memoizada.
 *
 * Ler documento a documento devolveria 404 para os que ainda não existem
 * (heroSection é um deles), e um 404 vira "erro de console" no Lighthouse.
 * Listar a coleção responde 200 mesmo quando um documento falta, e ainda
 * atende hero e about com uma chamada em vez de duas.
 */
let siteSettingsCache: Promise<Map<string, Record<string, unknown>>> | undefined;

function loadSiteSettings() {
  siteSettingsCache ??= listCollectionRest('siteSettings').then(
    (docs) => new Map(docs.map((doc) => [doc.id, doc.data])),
  );
  return siteSettingsCache;
}

export async function fetchHeroSettings(): Promise<Partial<HeroSettings>> {
  const settings = await loadSiteSettings();
  return (settings.get('heroSection') ?? {}) as Partial<HeroSettings>;
}

export async function fetchAboutSettings(): Promise<Partial<AboutSettings>> {
  const settings = await loadSiteSettings();
  return (settings.get('aboutSection') ?? {}) as Partial<AboutSettings>;
}

/** Uma leitura da coleção inteira, em vez de um listener por serviço. */
export async function fetchServiceImages(): Promise<Record<string, string>> {
  const docs = await listCollectionRest('siteSettings/servicesImages/items');
  const result: Record<string, string> = {};
  for (const { id, data } of docs) {
    if (typeof data.image === 'string') result[id] = data.image;
  }
  return result;
}

// ─── Updates ─────────────────────────────────────────────────

export async function updateHeroImage(url: string): Promise<void> {
  const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
  await fs.setDoc(fs.doc(db, 'siteSettings', 'heroSection'), { backgroundImage: url }, { merge: true });
}

export async function updateAboutImage(key: 'image1' | 'image2', url: string): Promise<void> {
  const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
  await fs.setDoc(fs.doc(db, 'siteSettings', 'aboutSection'), { [key]: url }, { merge: true });
}

export async function updateServiceImage(serviceId: number, url: string): Promise<void> {
  const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
  await fs.setDoc(
    fs.doc(fs.collection(db, 'siteSettings', 'servicesImages', 'items'), String(serviceId)),
    { image: url },
    { merge: true },
  );
}
