# Schema PostgreSQL

O schema inicial está em `database/migrations/001_initial_schema.sql`.

## Principais entidades

- `users`: líderes e administradores com autenticação JWT.
- `public_profiles`: dados opcionais de usuários públicos quando houver registro futuro.
- `events`: eventos públicos e internos.
- `event_photos`: fotos associadas a eventos.
- `projects`: os 7 projetos sociais.
- `project_photos`: galeria de cada projeto.
- `bases`: as 7 bases da missão.
- `house_groups`: grupos De Casa em Casa.
- `announcements`: avisos internos para líderes.
- `announcement_reads`: controle de leitura por líder.
- `documents`: PDFs da liderança.
- `live_services`: controle de live e gravações.
- `push_tokens`: tokens Expo Push Notifications.
- `notification_log`: auditoria de notificações enviadas.
