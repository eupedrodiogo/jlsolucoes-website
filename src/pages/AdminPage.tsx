import { useState, useCallback, useRef, useEffect } from 'react';
import {
  LogOut,
  Plus,
  Trash2,
  Upload,
  Images,
  ChevronLeft,
  X,
  FolderOpen,
  Loader2,
  Film,
  MessageCircle,
  LayoutTemplate,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { SiteImagesTab } from '@/components/admin/SiteImagesTab';
import { useAuth } from '@/hooks/useAuth';
import {
  subscribePortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  addMediaToItem,
  removeMediaFromItem,
} from '@/services/portfolioService';
import type { FirestorePortfolioItem } from '@/services/portfolioService';
import { uploadMedia, deleteMedia } from '@/services/storageService';
import { prepareUpload } from '@/lib/prepareUpload';
import { subscribeComments, deleteComment } from '@/services/interactionService';
import { PORTFOLIO_ITEMS } from '@/data/portfolio';
import type { MediaItem, Comment } from '@/types';

const CATEGORIES = ['Elétrica', 'Civil', 'Refrigeração', 'Hidráulica', 'Predial', 'Incêndio'];

type View = 'list' | 'gallery' | 'new' | 'comments';

interface NewProjectForm {
  title: string;
  category: string;
  description: string;
}

export function AdminPage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'siteImages'>('portfolio');
  const [view, setView] = useState<View>('list');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [form, setForm] = useState<NewProjectForm>({
    title: '',
    category: CATEGORIES[0],
    description: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverSuccess, setCoverSuccess] = useState(false);
  const [firestoreItems, setFirestoreItems] = useState<FirestorePortfolioItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const coverGalleryInputRef = useRef<HTMLInputElement>(null);

  // Subscrição ao Firestore
  useEffect(() => {
    const unsubscribe = subscribePortfolio(
      (items) => {
        setFirestoreItems(items);
        setLoadingItems(false);
      },
      () => {
        setLoadingItems(false);
      }
    );
    return unsubscribe;
  }, []);

  const selectedItem = firestoreItems.find((i) => i.id === selectedItemId) ?? null;

  const openGallery = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    setView('gallery');
  }, []);

  const openComments = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    setView('comments');
    setLoadingComments(true);
    const unsub = subscribeComments(
      itemId,
      (data) => { setComments(data); setLoadingComments(false); },
      () => setLoadingComments(false),
    );
    return unsub;
  }, []);

  const handleCoverGalleryUpload = useCallback(
    async (file: File | undefined | null, targetItemId?: string) => {
      const id = targetItemId || selectedItemId;
      if (!file || !id) return;
      setSelectedItemId(id); // Garante que o indicador visual apareça no card certo
      setUploadingCover(true);
      setCoverSuccess(false);
      try {
        const { file: prepared, extension } = await prepareUpload(file);
        const path = `portfolio/${id}/cover.${extension}`;
        const url = await uploadMedia(prepared, path, ({ progress: p }) =>
          setUploadProgress(Math.round(p)),
        );
        await updatePortfolioItem(id, { image: url });
        setCoverSuccess(true);
        setTimeout(() => setCoverSuccess(false), 3000);
      } catch (err) {
        console.error('Erro ao atualizar capa:', err);
        alert('Erro ao enviar imagem de capa.');
      } finally {
        setUploadingCover(false);
        setUploadProgress(0);
      }
    },
    [selectedItemId],
  );

  const handleBack = useCallback(() => {
    setView('list');
    setSelectedItemId(null);
  }, []);

  // === Upload de mídia para galeria ===
  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || !selectedItemId) return;

      setUploading(true);
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const isVideo = file.type.startsWith('video/');
          const { file: prepared, extension } = await prepareUpload(file);
          const path = `portfolio/${selectedItemId}/${Date.now()}_${i}.${extension}`;

          setUploadProgress(0);
          const url = await uploadMedia(prepared, path, ({ progress }) => {
            setUploadProgress(Math.round(progress));
          });

          const media: MediaItem = {
            type: isVideo ? 'video' : 'image',
            src: url,
            alt: file.name.replace(/\.[^.]+$/, ''),
          };

          await addMediaToItem(selectedItemId, media);
        }
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
        alert('Erro ao fazer upload. Tente novamente.');
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [selectedItemId],
  );

  // === Excluir mídia individual ===
  const handleDeleteMedia = useCallback(
    async (media: MediaItem) => {
      if (!selectedItemId) return;
      if (!confirm('Excluir esta mídia?')) return;

      setDeleting(media.src);
      try {
        if (media.src.includes('firebasestorage')) {
          await deleteMedia(media.src);
        }
        await removeMediaFromItem(selectedItemId, media);
      } catch (error) {
        console.error('Erro ao excluir mídia:', error);
        alert('Erro ao excluir mídia.');
      } finally {
        setDeleting(null);
      }
    },
    [selectedItemId],
  );

  // === Excluir projeto inteiro ===
  const handleDeleteProject = useCallback(
    async (itemId: string) => {
      if (!confirm('Excluir este projeto e todas as suas mídias? Esta ação é irreversível.'))
        return;

      setDeleting(itemId);
      try {
        const item = firestoreItems.find((i) => i.id === itemId);
        if (item) {
          for (const media of item.gallery) {
            if (media.src.includes('firebasestorage')) {
              await deleteMedia(media.src);
            }
          }
        }
        await deletePortfolioItem(itemId);
      } catch (error) {
        console.error('Erro ao excluir projeto:', error);
        alert('Erro ao excluir projeto.');
      } finally {
        setDeleting(null);
      }
    },
    [firestoreItems],
  );

  // === Criar novo projeto ===
  const handleCreateProject = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.title.trim() || !form.category) return;

      setUploading(true);
      try {
        let coverUrl = '';

        if (coverFile) {
          const { file: prepared, extension } = await prepareUpload(coverFile);
          const path = `portfolio/covers/${Date.now()}.${extension}`;
          coverUrl = await uploadMedia(prepared, path, ({ progress }) => {
            setUploadProgress(Math.round(progress));
          });
        }

        await addPortfolioItem({
          title: form.title.trim(),
          category: form.category,
          description: form.description.trim(),
          image: coverUrl,
          gallery: coverUrl
            ? [{ type: 'image', src: coverUrl, alt: form.title.trim() }]
            : [],
          order: firestoreItems.length + 1,
        });

        setForm({ title: '', category: CATEGORIES[0], description: '' });
        setCoverFile(null);
        setCoverPreview(null);
        setView('list');
      } catch (error) {
        console.error('Erro ao criar projeto:', error);
        alert('Erro ao criar projeto.');
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [form, coverFile, firestoreItems.length],
  );

  // === Seed: importar dados estáticos ===
  const handleSeed = useCallback(async () => {
    if (!confirm('Importar os 6 projetos iniciais para o Firestore?')) return;

    setSeeding(true);
    try {
      for (let i = 0; i < PORTFOLIO_ITEMS.length; i++) {
        const item = PORTFOLIO_ITEMS[i];
        await addPortfolioItem({
          title: item.title,
          category: item.category,
          description: item.description ?? '',
          image: item.image,
          gallery: item.gallery,
          order: i + 1,
        });
      }
      alert('Dados importados com sucesso!');
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      alert('Erro ao importar dados.');
    } finally {
      setSeeding(false);
    }
  }, []);

  // === Cover file handling ===
  const handleCoverChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  // === Drag & Drop ===
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-teal/20 flex items-center justify-center">
              <Images size={16} className="text-brand-teal" />
            </div>
            <div>
              <h1 className="text-white text-sm font-bold">Painel Admin</h1>
              <p className="text-gray-500 text-[11px]">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:block"
            >
              ← Voltar ao site
            </a>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-xs font-semibold hover:bg-red-900/50 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* ─── Tabs de navegação ─── */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'portfolio'
                ? 'border-brand-teal text-brand-teal'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Images size={14} />
            Portfólio
          </button>
          <button
            onClick={() => setActiveTab('siteImages')}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'siteImages'
                ? 'border-brand-teal text-brand-teal'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <LayoutTemplate size={14} />
            Imagens do Site
          </button>
        </div>
      </div>

      {/* ─── Inputs Globais Ocultos ─── */}
      <input
        ref={coverGalleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleCoverGalleryUpload(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* === ABA: Imagens do Site === */}
        {activeTab === 'siteImages' && <SiteImagesTab />}

        {/* === ABA: Portfólio === */}
        {activeTab === 'portfolio' && (
        <>
        {/* === VIEW: Lista de projetos === */}
        {view === 'list' && (
          <>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="text-white text-lg font-black">Projetos do Portfólio</h2>
              <div className="flex gap-2">
                {firestoreItems.length === 0 && !loadingItems && (
                  <button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-600/20 text-amber-400 border border-amber-600/30 rounded-xl text-xs font-bold hover:bg-amber-600/30 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {seeding ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <FolderOpen size={14} />
                    )}
                    {seeding ? 'Importando...' : 'Importar dados iniciais'}
                  </button>
                )}
                <button
                  onClick={() => setView('new')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-teal text-white rounded-xl text-xs font-bold hover:bg-brand-teal-light transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  Novo Projeto
                </button>
              </div>
            </div>

            {loadingItems ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-brand-teal" />
              </div>
            ) : firestoreItems.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <FolderOpen size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">Nenhum projeto no Firestore.</p>
                <p className="text-xs mt-1">
                  Clique em "Importar dados iniciais" para começar ou crie um novo projeto.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {firestoreItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
                  >
                    {item.image && (
                      <div 
                        className="h-36 overflow-hidden relative group"
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleCoverGalleryUpload(file, item.id);
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay para trocar capa rápido */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => {
                              setSelectedItemId(item.id);
                              coverGalleryInputRef.current?.click();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal/90 text-white rounded-lg text-xs font-bold hover:bg-brand-teal transition-colors cursor-pointer shadow-lg"
                          >
                            <ImageIcon size={14} />
                            Trocar Capa
                          </button>
                        </div>
                        {/* Indicadores de progresso de capa rápida (reaproveitando state) */}
                        {uploadingCover && selectedItemId === item.id && (
                          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-1 z-10">
                            <Loader2 size={20} className="animate-spin text-brand-teal" />
                            <span className="text-brand-teal text-[10px] font-bold">{uploadProgress}%</span>
                          </div>
                        )}
                        {coverSuccess && selectedItemId === item.id && !uploadingCover && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                            <CheckCircle2 size={28} className="text-green-400" />
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-white text-sm font-bold leading-tight">
                          {item.title}
                        </h3>
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mb-3 flex items-center gap-1">
                        <Images size={12} />
                        {item.gallery?.length ?? 0} mídias
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openGallery(item.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-800 text-gray-300 rounded-lg text-xs font-semibold hover:bg-brand-teal hover:text-white transition-colors cursor-pointer"
                        >
                          <Images size={13} />
                          Galeria
                        </button>
                        <button
                          onClick={() => openComments(item.id)}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-800 text-gray-400 rounded-lg text-xs font-semibold hover:bg-blue-900/50 hover:text-blue-400 transition-colors cursor-pointer"
                          title="Moderar comentários"
                        >
                          <MessageCircle size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(item.id)}
                          disabled={deleting === item.id}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-800 text-gray-400 rounded-lg text-xs font-semibold hover:bg-red-900/50 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {deleting === item.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* === VIEW: Novo Projeto === */}
        {view === 'new' && (
          <>
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-gray-400 text-xs font-semibold hover:text-white transition-colors mb-6 cursor-pointer"
            >
              <ChevronLeft size={14} />
              Voltar
            </button>

            <div className="max-w-lg mx-auto">
              <h2 className="text-white text-lg font-black mb-6">Novo Projeto</h2>
              <form onSubmit={handleCreateProject} className="space-y-5">
                <div>
                  <label className="block text-gray-300 text-xs font-bold mb-1.5">Título</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/30 outline-none transition-colors"
                    placeholder="Ex: Manutenção Elétrica Industrial"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-xs font-bold mb-1.5">Categoria</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/30 outline-none transition-colors cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-xs font-bold mb-1.5">Descrição</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/30 outline-none transition-colors resize-none"
                    placeholder="Descreva o projeto..."
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-xs font-bold mb-1.5">
                    Imagem de capa
                  </label>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                  {coverPreview ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden">
                      <img
                        src={coverPreview}
                        alt="Preview da capa"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverFile(null);
                          setCoverPreview(null);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-brand-teal hover:text-brand-teal transition-colors cursor-pointer"
                    >
                      <Upload size={20} />
                      <span className="text-xs font-semibold">Selecionar imagem</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploading || !form.title.trim()}
                  className="w-full py-3 bg-brand-teal text-white rounded-xl text-sm font-bold hover:bg-brand-teal-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Criando... {uploadProgress > 0 && `(${uploadProgress}%)`}
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Criar Projeto
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        )}

        {/* === VIEW: Galeria do projeto === */}
        {view === 'gallery' && selectedItem && (
          <>
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-gray-400 text-xs font-semibold hover:text-white transition-colors mb-6 cursor-pointer"
            >
              <ChevronLeft size={14} />
              Voltar
            </button>

            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-white text-lg font-black">{selectedItem.title}</h2>
                <p className="text-gray-500 text-xs mt-0.5">
                  {selectedItem.gallery?.length ?? 0} mídias na galeria
                </p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-3 py-1 rounded-full">
                {selectedItem.category}
              </span>
            </div>

            {/* ─── Foto de capa do projeto ─── */}
            <div className="mb-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <ImageIcon size={13} className="text-brand-teal" />
                Foto de capa
              </p>
              <div className="flex items-center gap-4">
                {/* Preview da capa atual */}
                <div className="relative shrink-0 w-28 h-20 rounded-lg overflow-hidden bg-gray-800">
                  {selectedItem.image ? (
                    <img
                      src={selectedItem.image}
                      alt="Capa atual"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={20} className="text-gray-600" />
                    </div>
                  )}
                  {uploadingCover && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-1">
                      <Loader2 size={16} className="animate-spin text-brand-teal" />
                      <span className="text-brand-teal text-[10px] font-bold">{uploadProgress}%</span>
                    </div>
                  )}
                  {coverSuccess && !uploadingCover && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <CheckCircle2 size={22} className="text-green-400" />
                    </div>
                  )}
                </div>
                {/* Botão de troca */}
                <div>
                  <button
                    onClick={() => coverGalleryInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-teal/20 text-brand-teal border border-brand-teal/30 rounded-lg text-xs font-bold hover:bg-brand-teal hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Upload size={13} />
                    Trocar capa
                  </button>
                  <p className="text-gray-500 text-[10px] mt-1.5">JPG, PNG, WEBP</p>
                </div>
              </div>
            </div>

            {/* Drop zone + Upload */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="mb-6 border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-brand-teal transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              {uploading ? (
                <div className="space-y-2">
                  <Loader2 size={24} className="mx-auto animate-spin text-brand-teal" />
                  <p className="text-brand-teal text-sm font-bold">
                    Enviando... {uploadProgress}%
                  </p>
                  <div className="w-48 mx-auto h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-teal rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 mx-auto text-gray-400 hover:text-brand-teal transition-colors cursor-pointer"
                >
                  <Upload size={28} />
                  <span className="text-sm font-bold">
                    Arraste arquivos aqui ou clique para selecionar
                  </span>
                  <span className="text-xs text-gray-600">Fotos (JPG, PNG) e Vídeos (MP4, MOV)</span>
                </button>
              )}
            </div>

            {/* Grid de mídias */}
            {selectedItem.gallery && selectedItem.gallery.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {selectedItem.gallery.map((media, idx) => (
                  <div
                    key={media.src + idx}
                    className="relative group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden aspect-[4/3]"
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full relative bg-gray-800">
                        <video
                          src={media.src}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Film size={32} className="text-white/50" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={media.src}
                        alt={media.alt ?? ''}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Overlay de exclusão */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleDeleteMedia(media)}
                        disabled={deleting === media.src}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {deleting === media.src ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Excluir
                      </button>
                    </div>

                    {/* Badge de tipo */}
                    <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white px-1.5 py-0.5 rounded">
                      {media.type === 'video' ? '🎬 Vídeo' : '📷 Foto'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <Images size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">Nenhuma mídia na galeria.</p>
                <p className="text-xs mt-1">Faça upload de fotos e vídeos acima.</p>
              </div>
            )}
          </>
        )}
        {/* === VIEW: Moderar comentários === */}
        {view === 'comments' && selectedItem && (
          <>
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-gray-400 text-xs font-semibold hover:text-white transition-colors mb-6 cursor-pointer"
            >
              <ChevronLeft size={14} />
              Voltar
            </button>

            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-white text-lg font-black">Comentários</h2>
                <p className="text-gray-500 text-xs mt-0.5">{selectedItem.title}</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                {comments.length} comentário{comments.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loadingComments ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-brand-teal" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">Nenhum comentário neste projeto ainda.</p>
              </div>
            ) : (
              <div className="space-y-3 max-w-2xl">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                      <span className="text-gray-300 font-bold text-xs uppercase">
                        {c.authorName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-white font-bold text-sm">{c.authorName}</span>
                        <span className="text-gray-500 text-[11px]">
                          {new Date(c.createdAt).toLocaleString('pt-BR', {
                            day: '2-digit', month: '2-digit', year: '2-digit',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed break-words">{c.text}</p>
                    </div>
                    <button
                      onClick={async () => {
                        if (!confirm('Excluir este comentário?')) return;
                        await deleteComment(selectedItem.id, c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-red-900/30 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-900/60 transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        </> /* fecha aba portfolio */
        )}
      </main>
    </div>
  );
}
