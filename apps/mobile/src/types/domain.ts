export type EventVisibility = 'public' | 'leadership';

export type AppEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt?: string;
  imageUrl?: string;
  visibility: EventVisibility;
  registrationEnabled: boolean;
  registrationWhatsApp?: string;
  registrationWhatsAppMessage?: string;
  price?: string;
  contactPhone?: string;
  signupUrl?: string;
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  beneficiaries?: string;
  schedule?: string;
  team?: string[];
  icon: string;
};

export type Highlight = {
  id: string;
  title: string;
  description: string;
};

export type ApiEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  starts_at: string;
  ends_at?: string | null;
  cover_image_url?: string | null;
  registration_enabled: boolean;
  signup_url?: string | null;
};

export type ApiProject = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  beneficiaries_count?: number | null;
  cover_image_url?: string | null;
  photos: Array<{ id: string; image_url: string; caption?: string | null }>;
  videos: Array<{ id: string; video_url: string; title?: string | null }>;
};

export type ApiLiveService = {
  id: string;
  title: string;
  youtube_url: string;
  is_live: boolean;
  starts_at?: string | null;
};

export type ApiVideo = {
  id: string;
  title: string;
  description?: string | null;
  video_url: string;
  created_at: string;
};
