import type { UploadTaskSnapshot } from 'firebase/storage';
import { getStorageInstance } from '@/lib/firebase';

export interface UploadProgress {
  progress: number;
  snapshot: UploadTaskSnapshot;
}

export async function uploadMedia(
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> {
  const [storage, m] = await Promise.all([getStorageInstance(), import('firebase/storage')]);

  return new Promise((resolve, reject) => {
    const storageRef = m.ref(storage, path);
    const uploadTask = m.uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.({ progress, snapshot });
      },
      (error) => reject(error),
      async () => {
        const url = await m.getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      },
    );
  });
}

export async function deleteMedia(url: string): Promise<void> {
  try {
    const [storage, m] = await Promise.all([getStorageInstance(), import('firebase/storage')]);
    const storageRef = m.ref(storage, url);
    await m.deleteObject(storageRef);
  } catch (error) {
    // Se o arquivo já não existe no Storage, ignora silenciosamente
    console.warn('Erro ao excluir mídia do Storage:', error);
  }
}
