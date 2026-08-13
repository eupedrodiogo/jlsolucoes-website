// ============================================================
// Tipos centralizados — tipagem estrita de todos os dados do site
// ============================================================

export interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar?: string;
  rating: number;
}

export type MediaType = 'image' | 'video';

export interface MediaItem {
  type: MediaType;
  src: string;
  alt?: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string;
  gallery: MediaItem[];
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Comment {
  id: string;
  portfolioItemId: string;
  authorName: string;
  text: string;
  createdAt: number; // timestamp ms
}

export interface LikeData {
  count: number;
  likedBy: string[]; // IDs anônimos gerados no localStorage
}
