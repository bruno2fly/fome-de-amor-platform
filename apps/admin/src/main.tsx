import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, Clapperboard, FolderHeart, LogOut, PlayCircle, Plus, Trash2, Upload } from 'lucide-react';
import { api, clearToken, getToken, setToken } from './api';
import { EventItem, LiveItem, ProjectItem, VideoItem } from './types';
import './styles.css';

type Section = 'events' | 'live' | 'videos' | 'projects';
type Editing = EventItem | LiveItem | VideoItem | ProjectItem | null;

const sections: Array<{ id: Section; label: string; icon: React.ReactNode }> = [
  { id: 'events', label: 'Agenda', icon: <CalendarDays size={18} /> },
  { id: 'live', label: 'Cultos', icon: <PlayCircle size={18} /> },
  { id: 'videos', label: 'Vídeos', icon: <Clapperboard size={18} /> },
  { id: 'projects', label: 'Projetos', icon: <FolderHeart size={18} /> }
];

function dateInputValue(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('patrick@fomedeamor.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.login(email, password);
      setToken(result.token);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login inválido.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="brand-mark">FA</div>
        <h1>Admin Fome de Amor</h1>
        <p>Entre para atualizar agenda, cultos, vídeos e projetos.</p>
        <label>
          E-mail
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label>
          Senha
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
        </label>
        {error ? <div className="error">{error}</div> : null}
        <button className="primary-button" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function UploadButton({ accept, multiple, onUploaded }: { accept: string; multiple?: boolean; onUploaded: (urls: string[]) => void }) {
  const [loading, setLoading] = useState(false);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setLoading(true);
    try {
      const urls = [];
      for (const file of Array.from(files)) {
        const result = await api.upload(file);
        urls.push(result.file.url);
      }
      onUploaded(urls);
    } finally {
      setLoading(false);
    }
  }

  return (
    <label className="upload-button">
      <Upload size={16} />
      {loading ? 'Enviando...' : multiple ? 'Enviar arquivos' : 'Enviar arquivo'}
      <input type="file" accept={accept} multiple={multiple} onChange={(event) => upload(event.target.files)} />
    </label>
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(getToken()));
  const [section, setSection] = useState<Section>('events');
  const [items, setItems] = useState<Array<EventItem | LiveItem | VideoItem | ProjectItem>>([]);
  const [editing, setEditing] = useState<Editing>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const title = useMemo(() => sections.find((item) => item.id === section)?.label ?? 'Admin', [section]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      if (section === 'events') setItems((await api.get<{ events: EventItem[] }>('/admin/events')).events);
      if (section === 'live') setItems((await api.get<{ liveServices: LiveItem[] }>('/admin/live')).liveServices);
      if (section === 'videos') setItems((await api.get<{ videos: VideoItem[] }>('/admin/videos')).videos);
      if (section === 'projects') setItems((await api.get<{ projects: ProjectItem[] }>('/admin/projects')).projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authenticated) void load();
  }, [authenticated, section]);

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

  function logout() {
    clearToken();
    setAuthenticated(false);
  }

  async function remove(id: string) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    await api.delete(`/admin/${section}/${id}`);
    await load();
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">FA</div>
          <div>
            <strong>Fome de Amor</strong>
            <span>Painel interno</span>
          </div>
        </div>
        <nav>
          {sections.map((item) => (
            <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <button className="logout" onClick={logout}><LogOut size={17} /> Sair</button>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            <p>Crie, edite e exclua conteúdos exibidos no aplicativo.</p>
          </div>
          <button className="primary-button" onClick={() => { setEditing(null); setCreating(true); }}>
            <Plus size={18} /> Novo
          </button>
        </header>

        {error ? <div className="error">{error}</div> : null}
        {loading ? <div className="empty">Carregando...</div> : <List section={section} items={items} onEdit={setEditing} onDelete={remove} />}
      </main>

      {(creating || editing) ? (
        <Editor
          section={section}
          item={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={async () => {
            setCreating(false);
            setEditing(null);
            await load();
          }}
        />
      ) : null}
    </div>
  );
}

function List({
  section,
  items,
  onEdit,
  onDelete
}: {
  section: Section;
  items: Array<EventItem | LiveItem | VideoItem | ProjectItem>;
  onEdit: (item: Editing) => void;
  onDelete: (id: string) => void;
}) {
  if (!items.length) return <div className="empty">Nenhum item cadastrado.</div>;

  return (
    <div className="list">
      {items.map((item) => (
        <article className="row-card" key={item.id}>
          <div>
            <h2>{'name' in item ? item.name : item.title}</h2>
            <p>{descriptionFor(section, item)}</p>
          </div>
          <div className="row-actions">
            <button onClick={() => onEdit(item)}>Editar</button>
            <button className="danger" onClick={() => onDelete(item.id)}><Trash2 size={16} /> Excluir</button>
          </div>
        </article>
      ))}
    </div>
  );
}

function descriptionFor(section: Section, item: EventItem | LiveItem | VideoItem | ProjectItem) {
  if (section === 'events') {
    const event = item as EventItem;
    return `${event.location} - ${event.starts_at ? new Date(event.starts_at).toLocaleString('pt-BR') : 'sem data'}`;
  }
  if (section === 'live') {
    const live = item as LiveItem;
    return `${live.youtube_url} - ${live.starts_at ? new Date(live.starts_at).toLocaleString('pt-BR') : 'sem data'}`;
  }
  if (section === 'projects') {
    const project = item as ProjectItem;
    return `${project.short_description} | ${project.photos?.length ?? 0} fotos | ${project.videos?.length ?? 0} vídeos`;
  }
  return (item as VideoItem).description ?? (item as VideoItem).video_url;
}

function Editor({ section, item, onClose, onSaved }: { section: Section; item: Editing; onClose: () => void; onSaved: () => void }) {
  if (section === 'events') return <EventForm item={item as EventItem | null} onClose={onClose} onSaved={onSaved} />;
  if (section === 'live') return <LiveForm item={item as LiveItem | null} onClose={onClose} onSaved={onSaved} />;
  if (section === 'videos') return <VideoForm item={item as VideoItem | null} onClose={onClose} onSaved={onSaved} />;
  return <ProjectForm item={item as ProjectItem | null} onClose={onClose} onSaved={onSaved} />;
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header>
          <h2>{title}</h2>
          <button onClick={onClose}>Fechar</button>
        </header>
        {children}
      </div>
    </div>
  );
}

function EventForm({ item, onClose, onSaved }: { item: EventItem | null; onClose: () => void; onSaved: () => void }) {
  const [imageUrl, setImageUrl] = useState(item?.cover_image_url ?? '');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = {
      title: String(form.get('title')),
      description: String(form.get('description')),
      location: String(form.get('location')),
      startsAt: new Date(String(form.get('startsAt'))).toISOString(),
      coverImageUrl: imageUrl || null,
      signupUrl: String(form.get('signupUrl') || '') || null,
      registrationEnabled: Boolean(String(form.get('signupUrl') || ''))
    };
    item ? await api.patch(`/admin/events/${item.id}`, body) : await api.post('/admin/events', body);
    onSaved();
  }

  return (
    <Modal title={item ? 'Editar evento' : 'Novo evento'} onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <Field label="Imagem"><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL da imagem" /></Field>
        <UploadButton accept="image/*" onUploaded={(urls) => setImageUrl(urls[0])} />
        <Field label="Título"><input name="title" defaultValue={item?.title} required /></Field>
        <Field label="Data e hora"><input name="startsAt" type="datetime-local" defaultValue={dateInputValue(item?.starts_at)} required /></Field>
        <Field label="Local"><input name="location" defaultValue={item?.location} required /></Field>
        <Field label="Link de inscrição opcional"><input name="signupUrl" defaultValue={item?.signup_url ?? ''} /></Field>
        <Field label="Descrição"><textarea name="description" defaultValue={item?.description} required /></Field>
        <button className="primary-button">Salvar</button>
      </form>
    </Modal>
  );
}

function LiveForm({ item, onClose, onSaved }: { item: LiveItem | null; onClose: () => void; onSaved: () => void }) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = {
      title: String(form.get('title')),
      youtubeUrl: String(form.get('youtubeUrl')),
      startsAt: new Date(String(form.get('startsAt'))).toISOString(),
      isLive: form.get('isLive') === 'on'
    };
    item ? await api.patch(`/admin/live/${item.id}`, body) : await api.post('/admin/live', body);
    onSaved();
  }

  return (
    <Modal title={item ? 'Editar culto' : 'Novo culto'} onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <Field label="Título"><input name="title" defaultValue={item?.title ?? 'Culto ao Vivo'} required /></Field>
        <Field label="Data e hora"><input name="startsAt" type="datetime-local" defaultValue={dateInputValue(item?.starts_at)} required /></Field>
        <Field label="Link da transmissão"><input name="youtubeUrl" defaultValue={item?.youtube_url} required /></Field>
        <label className="checkbox"><input name="isLive" type="checkbox" defaultChecked={item?.is_live} /> Ao vivo agora</label>
        <button className="primary-button">Salvar</button>
      </form>
    </Modal>
  );
}

function VideoForm({ item, onClose, onSaved }: { item: VideoItem | null; onClose: () => void; onSaved: () => void }) {
  const [videoUrl, setVideoUrl] = useState(item?.video_url ?? '');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = {
      title: String(form.get('title')),
      description: String(form.get('description')),
      videoUrl
    };
    item ? await api.patch(`/admin/videos/${item.id}`, body) : await api.post('/admin/videos', body);
    onSaved();
  }

  return (
    <Modal title={item ? 'Editar vídeo' : 'Novo vídeo'} onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <Field label="Arquivo ou link do vídeo"><input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required /></Field>
        <UploadButton accept="video/*" onUploaded={(urls) => setVideoUrl(urls[0])} />
        <Field label="Título"><input name="title" defaultValue={item?.title} required /></Field>
        <Field label="Descrição"><textarea name="description" defaultValue={item?.description ?? ''} /></Field>
        <button className="primary-button">Salvar</button>
      </form>
    </Modal>
  );
}

function ProjectForm({ item, onClose, onSaved }: { item: ProjectItem | null; onClose: () => void; onSaved: () => void }) {
  const [photos, setPhotos] = useState<string[]>(item?.photos?.map((photo) => photo.image_url) ?? []);
  const [videos, setVideos] = useState<string[]>(item?.videos?.map((video) => video.video_url) ?? []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const description = String(form.get('description'));
    const body = {
      name: String(form.get('name')),
      shortDescription: String(form.get('shortDescription') || description.slice(0, 140)),
      description,
      coverImageUrl: photos[0] ?? null,
      photos: photos.map((imageUrl) => ({ imageUrl })),
      videos: videos.map((videoUrl) => ({ videoUrl }))
    };
    item ? await api.patch(`/admin/projects/${item.id}`, body) : await api.post('/admin/projects', body);
    onSaved();
  }

  return (
    <Modal title={item ? 'Editar projeto' : 'Novo projeto'} onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <Field label="Nome"><input name="name" defaultValue={item?.name} required /></Field>
        <Field label="Resumo"><input name="shortDescription" defaultValue={item?.short_description} /></Field>
        <Field label="Descrição"><textarea name="description" defaultValue={item?.description} required /></Field>
        <div className="asset-box">
          <strong>Fotos</strong>
          <UploadButton accept="image/*" multiple onUploaded={(urls) => setPhotos((prev) => [...prev, ...urls])} />
          <textarea value={photos.join('\n')} onChange={(e) => setPhotos(e.target.value.split('\n').filter(Boolean))} placeholder="Uma URL de foto por linha" />
        </div>
        <div className="asset-box">
          <strong>Vídeos</strong>
          <UploadButton accept="video/*" multiple onUploaded={(urls) => setVideos((prev) => [...prev, ...urls])} />
          <textarea value={videos.join('\n')} onChange={(e) => setVideos(e.target.value.split('\n').filter(Boolean))} placeholder="Uma URL de vídeo por linha" />
        </div>
        <button className="primary-button">Salvar</button>
      </form>
    </Modal>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
