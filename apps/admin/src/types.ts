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
