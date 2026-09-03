-- Farhty — parrainage par invitation
--
-- Chaque invitation envoyée porte un lien vers /da3wa?ref=<id de l'invitation>.
-- Quand un invité revient commander la sienne, on garde l'invitation d'origine :
-- c'est la seule façon de savoir quel mariage ramène des clients.
--
-- Rejouable : `if not exists` partout, comme 001.

alter table invitations add column if not exists referred_by text;

-- « Combien de clients m'a ramené l'invitation X ? » — la requête de l'admin.
create index if not exists invitations_referred_by_idx
  on invitations (referred_by)
  where referred_by is not null;
