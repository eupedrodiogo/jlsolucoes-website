import type { Unsubscribe } from 'firebase/firestore';
import { getDb, firestoreModule, lazySubscribe } from '@/lib/firebase';
import { listCollectionRest } from '@/lib/firestoreRest';
import type { MediaItem } from '@/types';

export interface FirestorePortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  gallery: MediaItem[];
  order: number;
  createdAt?: unknown;
}

const COLLECTION = 'portfolioItems';

export function subscribePortfolio(
  callback: (items: FirestorePortfolioItem[]) => void,
  onError?: (error: any) => void
): Unsubscribe {
  return lazySubscribe(async () => {
    const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
    const q = fs.query(fs.collection(db, COLLECTION), fs.orderBy('order', 'asc'));
    return fs.onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as FirestorePortfolioItem[];
        callback(items);
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        onError?.(error);
      }
    );
  }, onError);
}

/**
 * Leitura única via REST — usada pela landing page. Evita baixar o SDK do
 * Firestore (166 KB gzip) só para listar o portfólio. Ver nota em
 * src/lib/firestoreRest.ts.
 */
export async function fetchPortfolio(): Promise<FirestorePortfolioItem[]> {
  const docs = await listCollectionRest(COLLECTION, 'order');
  return docs.map(({ id, data }) => ({ id, ...data })) as FirestorePortfolioItem[];
}

export async function addPortfolioItem(
  data: Omit<FirestorePortfolioItem, 'id' | 'createdAt'>,
): Promise<string> {
  const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
  const docRef = await fs.addDoc(fs.collection(db, COLLECTION), {
    ...data,
    createdAt: fs.serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePortfolioItem(
  id: string,
  data: Partial<Omit<FirestorePortfolioItem, 'id' | 'createdAt'>>,
): Promise<void> {
  const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
  await fs.updateDoc(fs.doc(db, COLLECTION, id), data);
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
  await fs.deleteDoc(fs.doc(db, COLLECTION, id));
}

export async function addMediaToItem(
  itemId: string,
  media: MediaItem,
): Promise<void> {
  const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
  await fs.updateDoc(fs.doc(db, COLLECTION, itemId), {
    gallery: fs.arrayUnion(media),
  });
}

export async function removeMediaFromItem(
  itemId: string,
  media: MediaItem,
): Promise<void> {
  const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
  await fs.updateDoc(fs.doc(db, COLLECTION, itemId), {
    gallery: fs.arrayRemove(media),
  });
}
