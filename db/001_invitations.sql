-- Farhty — table des invitations
-- À coller dans le SQL Editor de Neon (ou psql) une seule fois.

create table if not exists invitations (
  id          text primary key,           -- identifiant public, dans l'URL /i/<id>
  edit_token  text        not null,       -- secret : autorise la modification
  slug        text        not null,       -- modèle choisi
  draft       jsonb       not null,       -- contenu de l'invitation (noms, date, programme…)
  geo         jsonb,                      -- { lat, lng, address } — position de la salle
  layout      jsonb,                      -- placement libre des blocs sur la carte
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Retrouver rapidement les invitations d'un même modèle (statistiques, admin)
create index if not exists invitations_slug_idx on invitations (slug);

-- Purge éventuelle des brouillons jamais partagés :
--   delete from invitations where updated_at < now() - interval '1 year';

-- ── Paiement (ajouté après coup ; sûr à rejouer) ──
alter table invitations add column if not exists plan    text  not null default 'elegante';
alter table invitations add column if not exists payment jsonb not null default '{"status":"unpaid","amountDT":49}'::jsonb;

-- Retrouver les paiements à vérifier
create index if not exists invitations_payment_status_idx
  on invitations ((payment->>'status'));
