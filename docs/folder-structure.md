# Estrutura completa de pastas

```text
fome-de-amor/
├── apps/
│   ├── api/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── config/
│   │       │   ├── database.ts
│   │       │   └── env.ts
│   │       ├── controllers/
│   │       │   ├── announcements.controller.ts
│   │       │   ├── auth.controller.ts
│   │       │   ├── documents.controller.ts
│   │       │   ├── events.controller.ts
│   │       │   ├── leaders.controller.ts
│   │       │   ├── live.controller.ts
│   │       │   └── projects.controller.ts
│   │       ├── middleware/
│   │       │   ├── auth.ts
│   │       │   ├── error-handler.ts
│   │       │   └── role.ts
│   │       ├── routes/
│   │       │   ├── admin.routes.ts
│   │       │   ├── auth.routes.ts
│   │       │   ├── leadership.routes.ts
│   │       │   └── public.routes.ts
│   │       ├── services/
│   │       │   ├── notifications.service.ts
│   │       │   └── storage.service.ts
│   │       ├── types/
│   │       │   └── express.d.ts
│   │       ├── utils/
│   │       │   └── async-handler.ts
│   │       └── server.ts
│   └── mobile/
│       ├── app.json
│       ├── babel.config.js
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── assets/
│           ├── components/
│           │   ├── EventCard.tsx
│           │   └── SectionHeader.tsx
│           ├── constants/
│           │   └── theme.ts
│           ├── data/
│           │   └── seed.ts
│           ├── navigation/
│           │   ├── AppNavigator.tsx
│           │   └── types.ts
│           ├── screens/
│           │   ├── admin/
│           │   │   └── AdminHomeScreen.tsx
│           │   ├── leadership/
│           │   │   └── LeadershipHomeScreen.tsx
│           │   └── public/
│           │       ├── AboutScreen.tsx
│           │       ├── DonationScreen.tsx
│           │       ├── EventsScreen.tsx
│           │       ├── HomeScreen.tsx
│           │       ├── LiveScreen.tsx
│           │       └── ProjectsScreen.tsx
│           ├── services/
│           │   ├── api.ts
│           │   └── notifications.ts
│           └── types/
│               └── domain.ts
├── database/
│   └── migrations/
│       └── 001_initial_schema.sql
├── docs/
│   ├── database-schema.md
│   └── folder-structure.md
├── package.json
└── README.md
```
