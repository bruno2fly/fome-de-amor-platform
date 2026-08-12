CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

CREATE TYPE user_role AS ENUM ('leader', 'admin');
CREATE TYPE event_visibility AS ENUM ('public', 'leadership');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled');
CREATE TYPE document_category AS ENUM ('escala', 'treinamento', 'financeiro', 'atas', 'outros');
CREATE TYPE announcement_status AS ENUM ('draft', 'published');
CREATE TYPE notification_audience AS ENUM ('all_users', 'leaders_only', 'individual');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'leader',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email CITEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  cover_image_url TEXT,
  visibility event_visibility NOT NULL DEFAULT 'public',
  status event_status NOT NULL DEFAULT 'published',
  registration_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  push_on_publish BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX events_starts_at_idx ON events(starts_at);
CREATE INDEX events_visibility_status_idx ON events(visibility, status);

CREATE TABLE event_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  beneficiaries_count INTEGER,
  cover_image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  instagram_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE house_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  neighborhood TEXT,
  weekday TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status announcement_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE announcement_reads (
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (announcement_id, user_id)
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category document_category NOT NULL DEFAULT 'outros',
  file_url TEXT NOT NULL,
  file_size_bytes INTEGER,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX documents_category_published_idx ON documents(category, published_at DESC);

CREATE TABLE live_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'Culto ao Vivo',
  youtube_url TEXT NOT NULL,
  is_live BOOLEAN NOT NULL DEFAULT FALSE,
  starts_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  platform TEXT NOT NULL,
  public_profile_id UUID REFERENCES public_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (public_profile_id IS NOT NULL OR user_id IS NOT NULL)
);

CREATE TABLE notification_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audience notification_audience NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  expo_ticket_id TEXT,
  related_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  related_announcement_id UUID REFERENCES announcements(id) ON DELETE SET NULL,
  related_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO projects (name, slug, short_description, description, beneficiaries_count, sort_order) VALUES
  ('AmorKids', 'amorkids', 'Contraturno escolar para 25 crianças.', 'Programa de contraturno com cuidado, ensino, alimentação e acompanhamento para crianças.', 25, 1),
  ('Fome de Bola', 'fome-de-bola', 'Escolinha de futebol gratuita para 60 crianças.', 'Projeto esportivo que une futebol, disciplina, convivência e valores cristãos.', 60, 2),
  ('Talmidim', 'talmidim', 'Valores e cidadania para 60 crianças.', 'Programa de formação em valores, cidadania e desenvolvimento humano.', 60, 3),
  ('Restaurante Comunitário', 'restaurante-comunitario', 'Restaurante com 4 refeições gratuitas por dia.', 'Atendimento alimentar diário para pessoas em situação de vulnerabilidade.', NULL, 4),
  ('Casa de Passagem', 'casa-de-passagem', 'Abrigo 24h com assistentes sociais.', 'Acolhimento temporário com suporte social, cuidado e encaminhamento.', NULL, 5),
  ('Padaria Solidária', 'padaria-solidaria', 'Produção solidária para apoiar a comunidade.', 'Padaria voltada a capacitação, geração de recursos e apoio alimentar.', NULL, 6),
  ('Corrida Solidária / RUN DAY', 'run-day', 'Corrida anual com mais de 700 atletas.', 'Evento esportivo beneficente que mobiliza a cidade em favor dos projetos sociais.', 700, 7);
