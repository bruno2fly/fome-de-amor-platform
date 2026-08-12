# Fome de Amor

Aplicativo oficial da missão social cristã Fome de Amor.

## Estrutura

```text
fome-de-amor/
├── apps/
│   ├── api/              # Backend Node.js + Express + PostgreSQL
│   └── mobile/           # App React Native + Expo
├── database/
│   └── migrations/       # Schema PostgreSQL versionado
└── docs/                 # Documentação técnica do projeto
```

## Primeiros comandos

```bash
npm install
npm run api
npm run admin
npm run mobile
```

## Banco local

```bash
createdb fome_de_amor
DATABASE_URL=postgres:///fome_de_amor npm run migrate --workspace apps/api
DATABASE_URL=postgres:///fome_de_amor npm run seed:admin --workspace apps/api
```

Admin dev:

- E-mail: `patrick@fomedeamor.com`
- Senha: `FomeAdmin-KOTWC13TmLCQ`

## Variáveis de ambiente

API (`apps/api/.env`):

```bash
DATABASE_URL=postgres:///fome_de_amor
JWT_SECRET=replace-with-a-long-random-secret
PORT=4000
PUBLIC_BASE_URL=http://localhost:4000
UPLOAD_DIR=uploads
STORAGE_DRIVER=local
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_BASE_URL=
ADMIN_EMAIL=patrick@fomedeamor.com
ADMIN_PASSWORD=FomeAdmin-KOTWC13TmLCQ
```

Admin web (`apps/admin/.env`):

```bash
VITE_API_URL=http://localhost:4000
```

Mobile (`apps/mobile/.env`):

```bash
EXPO_PUBLIC_API_URL=http://localhost:4000
```

## Render production

This repo includes `render.yaml` for a Render Web Service plus Render PostgreSQL. Do not deploy the admin panel from this blueprint; `apps/admin/dist` can be hosted separately.

Production API env vars:

```bash
DATABASE_URL=<Render PostgreSQL internal connection string>
JWT_SECRET=<strong random secret>
PUBLIC_BASE_URL=https://<render-api-service>.onrender.com
STORAGE_DRIVER=r2
R2_ENDPOINT=https://<cloudflare-account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<r2 access key>
R2_SECRET_ACCESS_KEY=<r2 secret key>
R2_BUCKET=<bucket name>
R2_PUBLIC_BASE_URL=https://<public r2 cdn domain>
```

## MVP

- Área pública: Início, Eventos, Projetos, Sobre, Doação e Ao Vivo.
- Área de liderança: calendário interno, avisos e documentos.
- Painel administrativo: eventos, líderes, avisos, documentos e controle da live.
- Notificações push básicas via Expo Push Notifications.
