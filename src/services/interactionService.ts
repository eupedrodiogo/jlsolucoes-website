import type { Unsubscribe } from 'firebase/firestore';
import { getDb, firestoreModule, lazySubscribe } from '@/lib/firebase';
import type { Comment, LikeData } from '@/types';

// ─── Comentários ─────────────────────────────────────────────

export function subscribeComments(
  itemId: string,
  callback: (comments: Comment[]) => void,
  onError?: (err: unknown) => void,
): Unsubscribe {
  return lazySubscribe(async () => {
    const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
    const q = fs.query(
      fs.collection(db, 'portfolioItems', itemId, 'comments'),
      fs.orderBy('createdAt', 'asc'),
    );
    return fs.onSnapshot(
      q,
      (snapshot) => {
        const comments: Comment[] = snapshot.docs.map((d) => ({
          id: d.id,
          portfolioItemId: itemId,
          authorName: (d.data().authorName as string) || 'Visitante',
          text: d.data().text as string,
          createdAt: (d.data().createdAt?.toMillis?.() ?? Date.now()) as number,
        }));
        callback(comments);
      },
      (err) => {
        console.error('subscribeComments error:', err);
        onError?.(err);
      },
    );
  }, onError);
}

export async function addComment(
  itemId: string,
  authorName: string,
  text: string,
): Promise<void> {
  const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
  await fs.addDoc(fs.collection(db, 'portfolioItems', itemId, 'comments'), {
    authorName: authorName.trim() || 'Visitante',
    text: text.trim(),
    createdAt: fs.serverTimestamp(),
  });
}

export async function deleteComment(
  itemId: string,
  commentId: string,
): Promise<void> {
  const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
  await fs.deleteDoc(fs.doc(db, 'portfolioItems', itemId, 'comments', commentId));
}

// ─── Curtidas ─────────────────────────────────────────────────

export function subscribeLikes(
  itemId: string,
  callback: (data: LikeData) => void,
  onError?: (err: unknown) => void,
): Unsubscribe {
  return lazySubscribe(async () => {
    const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
    return fs.onSnapshot(
      fs.doc(db, 'portfolioItems', itemId, 'meta', 'likes'),
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as LikeData);
        } else {
          callback({ count: 0, likedBy: [] });
        }
      },
      (err) => {
        console.error('subscribeLikes error:', err);
        onError?.(err);
      },
    );
  }, onError);
}

export async function toggleLike(
  itemId: string,
  visitorId: string,
  alreadyLiked: boolean,
): Promise<void> {
  const [db, fs] = await Promise.all([getDb(), firestoreModule()]);
  const ref = fs.doc(db, 'portfolioItems', itemId, 'meta', 'likes');
  const snap = await fs.getDoc(ref);

  if (!snap.exists()) {
    // Cria o documento de likes pela primeira vez
    await fs.setDoc(ref, {
      count: alreadyLiked ? 0 : 1,
      likedBy: alreadyLiked ? [] : [visitorId],
    });
    return;
  }

  await fs.setDoc(
    ref,
    {
      count: fs.increment(alreadyLiked ? -1 : 1),
      likedBy: alreadyLiked ? fs.arrayRemove(visitorId) : fs.arrayUnion(visitorId),
    },
    { merge: true },
  );
}
