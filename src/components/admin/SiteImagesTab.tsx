/**
 * SiteImagesTab — aba do painel admin para gerenciar imagens das seções do site.
 * Upload para Firebase Storage → URL salva no Firestore → landing page atualiza em tempo real.
 */
import { useState, useRef, useCallback } from 'react';
import { Upload, Loader2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { uploadMedia } from '@/services/storageService';
import { prepareUpload } from '@/lib/prepareUpload';
import {
  updateHeroImage,
  updateAboutImage,
  updateServiceImage,
} from '@/services/siteSettingsService';
import { useHeroImage, useAboutImages, useAllServicesImages } from '@/hooks/useSiteSettings';
import { SERVICES } from '@/data/services';

// ─── Sub-componente: card de upload individual ────────────────

interface ImageUploadCardProps {
  label: string;
  currentSrc: string;
  storagePath: string;
  onUploadSuccess: (url: string) => Promise<void>;
  aspectClass?: string;
}

function ImageUploadCard({
  label,
  currentSrc,
  storagePath,
  onUploadSuccess,
  aspectClass = 'aspect-video',
}: ImageUploadCardProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setUploading(true);
      setSuccess(false);
      setProgress(0);
      try {
        const { file: prepared, extension } = await prepareUpload(file);
        const path = `${storagePath}.${extension}`;
        const url = await uploadMedia(prepared, path, ({ progress: p }) =>
          setProgress(Math.round(p)),
        );
        await onUploadSuccess(url);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        console.error('Erro ao fazer upload:', err);
        alert('Erro ao enviar imagem. Tente novamente.');
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [storagePath, onUploadSuccess],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Preview */}
      <div
        className={`relative ${aspectClass} bg-gray-800 overflow-hidden`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {currentSrc ? (
          <img
            src={currentSrc}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={32} className="text-gray-600" />
          </div>
        )}

        {/* Overlay de upload */}
        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-brand-teal" />
            <p className="text-brand-teal text-sm font-bold">{progress}%</p>
            <div className="w-32 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-teal rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Sucesso */}
        {success && !uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <CheckCircle size={32} className="text-green-400" />
          </div>
        )}
      </div>

      {/* Rodapé com label e botão */}
      <div className="p-3 flex items-center justify-between gap-2">
        <p className="text-gray-300 text-xs font-semibold truncate">{label}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal/20 text-brand-teal border border-brand-teal/30 rounded-lg text-xs font-bold hover:bg-brand-teal hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Upload size={12} />
          Trocar
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal da aba ──────────────────────────────

export function SiteImagesTab() {
  // realtime: no painel o preview precisa refletir o upload na hora.
  const heroImage = useHeroImage(true);
  const aboutImages = useAboutImages(true);
  const servicesImages = useAllServicesImages(true);

  return (
    <div className="space-y-10">
      {/* ── HERO ────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-brand-teal">
            Hero
          </span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>
        <div className="max-w-sm">
          <ImageUploadCard
            label="Foto do lado direito"
            currentSrc={heroImage}
            storagePath="site-settings/hero/hero-bg"
            onUploadSuccess={updateHeroImage}
            aspectClass="aspect-[16/9]"
          />
        </div>
      </section>

      {/* ── SOBRE ───────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-brand-teal">
            Sobre / Nossa História
          </span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <ImageUploadCard
            label="Imagem grande (fundo)"
            currentSrc={aboutImages.image1}
            storagePath="site-settings/about/about-image1"
            onUploadSuccess={(url) => updateAboutImage('image1', url)}
            aspectClass="aspect-[4/3]"
          />
          <ImageUploadCard
            label="Imagem pequena (frente)"
            currentSrc={aboutImages.image2}
            storagePath="site-settings/about/about-image2"
            onUploadSuccess={(url) => updateAboutImage('image2', url)}
            aspectClass="aspect-[4/3]"
          />
        </div>
      </section>

      {/* ── SERVIÇOS ────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-brand-teal">
            Serviços ({SERVICES.length} cards)
          </span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SERVICES.map((service) => (
            <ImageUploadCard
              key={service.id}
              label={service.title}
              currentSrc={servicesImages[service.id] ?? service.image}
              storagePath={`site-settings/services/service-${service.id}`}
              onUploadSuccess={(url) => updateServiceImage(service.id, url)}
              aspectClass="aspect-[4/3]"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
