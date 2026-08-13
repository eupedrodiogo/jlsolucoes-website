import { useState, useEffect, useCallback, useRef } from 'react';
import {
  subscribeComments,
  addComment,
  deleteComment,
  subscribeLikes,
  toggleLike,
} from '@/services/interactionService';
import type { Comment, LikeData } from '@/types';

// ─── ID anônimo persistido no localStorage ───────────────────

function getVisitorId(): string {
  const key = 'jl_visitor_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `v_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem(key, id);
  }
  return id;
}

// ─── Hook ─────────────────────────────────────────────────────

interface UseInteractionsReturn {
  comments: Comment[];
  likeData: LikeData;
  alreadyLiked: boolean;
  loadingComments: boolean;
  submitting: boolean;
  handleToggleLike: () => Promise<void>;
  handleAddComment: (authorName: string, text: string) => Promise<void>;
  handleDeleteComment: (commentId: string) => Promise<void>;
}

export function useInteractions(portfolioItemId: string): UseInteractionsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likeData, setLikeData] = useState<LikeData>({ count: 0, likedBy: [] });
  const [loadingComments, setLoadingComments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const visitorId = useRef(getVisitorId()).current;

  const alreadyLiked = likeData.likedBy.includes(visitorId);

  // Subscrição aos comentários
  useEffect(() => {
    setLoadingComments(true);
    const unsub = subscribeComments(
      portfolioItemId,
      (data) => {
        setComments(data);
        setLoadingComments(false);
      },
      () => setLoadingComments(false),
    );
    return unsub;
  }, [portfolioItemId]);

  // Subscrição às curtidas
  useEffect(() => {
    const unsub = subscribeLikes(portfolioItemId, setLikeData);
    return unsub;
  }, [portfolioItemId]);

  const handleToggleLike = useCallback(async () => {
    try {
      await toggleLike(portfolioItemId, visitorId, alreadyLiked);
    } catch (err) {
      console.error('Erro ao curtir:', err);
    }
  }, [portfolioItemId, visitorId, alreadyLiked]);

  const handleAddComment = useCallback(
    async (authorName: string, text: string) => {
      if (!text.trim()) return;
      setSubmitting(true);
      try {
        await addComment(portfolioItemId, authorName, text);
      } catch (err) {
        console.error('Erro ao comentar:', err);
      } finally {
        setSubmitting(false);
      }
    },
    [portfolioItemId],
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      try {
        await deleteComment(portfolioItemId, commentId);
      } catch (err) {
        console.error('Erro ao deletar comentário:', err);
      }
    },
    [portfolioItemId],
  );

  return {
    comments,
    likeData,
    alreadyLiked,
    loadingComments,
    submitting,
    handleToggleLike,
    handleAddComment,
    handleDeleteComment,
  };
}
