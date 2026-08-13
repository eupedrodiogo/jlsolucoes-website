import { useState, useCallback, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  Loader2,
} from 'lucide-react';
import type { PortfolioItem } from '@/types';
import { buildWhatsappLink } from '@/constants';
import { useInteractions } from '@/hooks/useInteractions';
import { useAuth } from '@/hooks/useAuth';

interface PortfolioLightboxProps {
  item: PortfolioItem;
  onClose: () => void;
  /** ID string do Firestore (necessário para curtidas/comentários) */
  firestoreId?: string;
}

function formatTimeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export function PortfolioLightbox({ item, onClose, firestoreId }: PortfolioLightboxProps) {
  // ─── Galeria ────────────────────────────────────────────────
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const media = item.gallery;
  const current = media[activeIndex];
  const total = media.length;

  useEffect(() => { setActiveIndex(0); }, [item.id]);

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  }, [isAnimating]);

  const goPrev = useCallback(() => goTo(activeIndex <= 0 ? total - 1 : activeIndex - 1), [activeIndex, total, goTo]);
  const goNext = useCallback(() => goTo(activeIndex >= total - 1 ? 0 : activeIndex + 1), [activeIndex, total, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext, onClose]);

  // ─── Interações ──────────────────────────────────────────────
  // Usa o ID do item (pode ser numérico fallback ou string do Firestore)
  const interactionId = firestoreId ?? String(item.id);
  const {
    comments,
    likeData,
    alreadyLiked,
    loadingComments,
    submitting,
    handleToggleLike,
    handleAddComment,
    handleDeleteComment,
  } = useInteractions(interactionId);

  const { isAdmin } = useAuth();

  // ─── Formulário de comentário ─────────────────────────────────
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ao receber novo comentário
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments.length]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!commentText.trim()) return;
      await handleAddComment(authorName, commentText);
      setCommentText('');
    },
    [authorName, commentText, handleAddComment],
  );

  const waLink = buildWhatsappLink(
    `Olá! Vi o projeto "${item.title}" no portfólio e gostaria de saber mais.`,
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Post: ${item.title}`}
    >
      <div
        className="relative bg-white w-full max-w-7xl h-[100dvh] lg:h-[90vh] lg:rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar — sempre visível no mobile, topo direito */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="lg:hidden absolute top-3 right-3 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* ─── COLUNA ESQUERDA — Mídia ─────────────────────── */}
        <div className="relative bg-black flex flex-col h-[44vh] shrink-0 lg:flex-1 lg:h-auto">

          {/* Área da mídia */}
          <div className="relative flex-1 flex items-center justify-center min-h-[220px] sm:min-h-[320px] lg:min-h-0 lg:h-full">
            {/* Seta esquerda */}
            {total > 1 && (
              <button
                onClick={goPrev}
                aria-label="Anterior"
                className="absolute left-2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/35 backdrop-blur-sm transition-all cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Mídia principal */}
            <div className="w-full h-full flex items-center justify-center px-12 py-4">
              {current?.type === 'video' ? (
                <video
                  key={current.src}
                  src={current.src}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="max-w-full max-h-[55vh] lg:max-h-full rounded-lg object-contain"
                />
              ) : (
                <img
                  key={current?.src}
                  src={current?.src}
                  alt={current?.alt ?? item.title}
                  className="max-w-full max-h-[55vh] lg:max-h-full rounded-lg object-contain transition-opacity duration-300"
                />
              )}
            </div>

            {/* Seta direita */}
            {total > 1 && (
              <button
                onClick={goNext}
                aria-label="Próxima"
                className="absolute right-2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/35 backdrop-blur-sm transition-all cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          {/* Thumbnails */}
          {total > 1 && (
            <div className="px-4 py-2 border-t border-white/10">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-0.5 justify-center">
                {media.map((m, idx) => (
                  <button
                    key={m.src}
                    onClick={() => goTo(idx)}
                    aria-label={`Mídia ${idx + 1}`}
                    className={`relative shrink-0 w-12 h-9 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === activeIndex
                        ? 'border-white scale-110'
                        : 'border-white/20 opacity-50 hover:opacity-90'
                    }`}
                  >
                    {m.type === 'video' ? (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">▶</span>
                      </div>
                    ) : (
                      <img src={m.src} alt={m.alt ?? ''} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
              {/* Contador */}
              <p className="text-center text-white/40 text-[10px] mt-1">
                {activeIndex + 1} / {total}
              </p>
            </div>
          )}
        </div>

        {/* ─── COLUNA DIREITA — Info + Interações ──────────── */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto lg:overflow-hidden lg:w-[400px] lg:shrink-0 lg:flex-none bg-white">
          {/* Header do post */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar / ícone da empresa */}
              <div className="w-9 h-9 rounded-full bg-brand-teal flex items-center justify-center shrink-0">
                <span className="text-white font-black text-xs">JL</span>
              </div>
              <div className="min-w-0">
                <p className="text-gray-900 font-bold text-sm leading-tight truncate">JL Soluções</p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
            {/* Fechar — desktop */}
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="hidden lg:flex w-8 h-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:rotate-90 transition-all duration-300 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Descrição do projeto */}
          <div className="px-4 py-3 border-b border-gray-100 shrink-0">
            <p className="text-gray-900 font-bold text-sm mb-1">{item.title}</p>
            {item.description && (
              <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
            )}
          </div>

          {/* ─── Comentários (scrollável) ─── */}
          <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 space-y-3 scrollbar-thin">
            {loadingComments ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-gray-400 text-xs py-6">
                Nenhum comentário ainda. Seja o primeiro! 👇
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2 group">
                  {/* Avatar do comentarista */}
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-gray-600 font-bold text-[10px] uppercase">
                      {c.authorName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-gray-900 font-bold text-xs">{c.authorName}</span>
                      <span className="text-gray-400 text-[10px]">
                        {formatTimeAgo(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-xs mt-0.5 leading-relaxed break-words">
                      {c.text}
                    </p>
                  </div>
                  {/* Excluir — só admin */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      aria-label="Excluir comentário"
                      className="opacity-0 group-hover:opacity-100 shrink-0 text-red-400 hover:text-red-600 transition-all cursor-pointer mt-0.5"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))
            )}
            <div ref={commentsEndRef} />
          </div>

          {/* ─── Barra de curtidas ─── */}
          <div className="px-4 py-2.5 border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-4 mb-1.5">
              {/* Curtir */}
              <button
                onClick={handleToggleLike}
                aria-label={alreadyLiked ? 'Remover curtida' : 'Curtir'}
                className={`flex items-center gap-1.5 group transition-all cursor-pointer ${
                  alreadyLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <Heart
                  size={22}
                  className={`transition-transform duration-150 ${
                    alreadyLiked ? 'fill-red-500 scale-110' : 'group-hover:scale-110'
                  }`}
                />
              </button>
              {/* Ícone comentário (decorativo — rola até o input) */}
              <button
                onClick={() => {
                  const input = document.getElementById('comment-input');
                  input?.focus();
                }}
                aria-label="Comentar"
                className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <MessageCircle size={22} />
              </button>
              {/* Link WhatsApp */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto shrink-0 inline-flex items-center gap-1.5 bg-brand-yellow text-brand-teal font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl hover:bg-[#e5b800] transition-colors shadow-sm"
              >
                <Phone size={12} />
                Falar
              </a>
            </div>
            <p className="text-gray-900 font-bold text-xs">
              {likeData.count === 0
                ? 'Seja o primeiro a curtir'
                : `${likeData.count} curtida${likeData.count !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* ─── Input de comentário ─── */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-100 px-4 py-2.5 shrink-0 bg-white"
          >
            {/* Campo de nome (primeira vez que for comentar) */}
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value.slice(0, 40))}
              placeholder="Seu nome (opcional)"
              maxLength={40}
              className="w-full text-xs text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none mb-1"
            />
            <div className="flex items-center gap-2">
              <input
                id="comment-input"
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value.slice(0, 280))}
                placeholder="Adicione um comentário..."
                maxLength={280}
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || submitting}
                aria-label="Publicar comentário"
                className={`flex items-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                  commentText.trim() && !submitting
                    ? 'text-brand-teal hover:text-brand-teal-light'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Postar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
