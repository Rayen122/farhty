-- Farhty — invités et confirmations de présence
--
-- Jusqu'ici le « RSVP » vendu sur la page tarifs n'existait que dans le
-- navigateur de l'invité : un useState par design, jamais transmis. Cette
-- table lui donne enfin un endroit où atterrir.
--
-- Un mariage tunisien s'invite par famille, pas par personne : `seats` compte
-- les places, et c'est ce chiffre-là que la salle et le traiteur réclament.
--
-- Rejouable : `if not exists` partout, comme 001 et 002.

create table if not exists guests (
  -- Identifiant court : il voyage dans l'URL (/i/<invitation>?g=<id>) et fait
  -- office de capacité. Celui qui l'a peut répondre pour cette famille.
  id             text primary key,
  invitation_id  text not null references invitations(id) on delete cascade,

  name           text not null,
  -- Places prévues par les mariés, avant toute réponse. Peut rester nul.
  seats          integer,

  -- pending → yes | no
  status         text not null default 'pending',
  -- Places réellement confirmées par la famille
  confirmed_seats integer,
  -- Mot laissé aux mariés
  message        text,

  -- Suivi d'envoi, pour savoir qui relancer
  sent_at        timestamptz,
  opened_at      timestamptz,
  responded_at   timestamptz,

  -- `list` : saisi par les mariés. `self` : l'invité s'est nommé lui-même
  -- en ouvrant le lien ouvert, sans figurer dans la liste de départ.
  source         text not null default 'list',

  created_at     timestamptz not null default now()
);

-- La requête de l'écran d'envoi : tous les invités d'une invitation.
create index if not exists guests_invitation_idx on guests (invitation_id, created_at);

-- Deux familles peuvent porter le même nom, mais pas dans la même invitation
-- via le lien ouvert : évite qu'un invité qui retape son nom crée un doublon.
create unique index if not exists guests_invitation_name_idx
  on guests (invitation_id, lower(name));
