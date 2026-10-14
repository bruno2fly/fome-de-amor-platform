export type EventItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  starts_at: string;
  ends_at?: string | null;
  cover_image_url?: string | null;
  signup_url?: string | null;
  registration_enabled: boolean;
};

export type LiveItem = {
  id: string;
  title: string;
  youtube_url: string;
  starts_at?: string | null;
  is_live: boolean;
};

export type VideoItem = {
  id: string;
  title: string;
  description?: string | null;
  video_url: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  short_description: string;
  description: string;
  cover_image_url?: string | null;
  photos: Array<{ id?: string; image_url: string; caption?: string | null }>;
  videos: Array<{ id?: string; video_url: string; title?: string | null }>;
};

export type RundayRegistration = {
  order_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  nome: string;
  nascimento: string;
  email: string;
  cpf: string;
  cidade: string;
  grupo: string | null;
  percurso: string;
  plano: string;
  tamanho: string | null;
  amount: string;
  amount_paid: string | null;
  payment_id: string | null;
  paid_at: string | null;
  created_at: string;
};

export type RundaySummary = {
  paidCount: number;
  pendingCount: number;
  totalCollected: number;
  byPercurso: Record<string, number>;
  byPlano: Record<string, number>;
  byTamanho: Record<string, number>;
};
