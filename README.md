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

## MVP

- Área pública: Início, Eventos, Projetos, Sobre, Doação e Ao Vivo.
- Área de liderança: calendário interno, avisos e documentos.
- Painel administrativo: eventos, líderes, avisos, documentos e controle da live.
- Notificações push básicas via Expo Push Notifications.
