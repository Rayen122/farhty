-- Farhty — check-in à l'entrée (Pack Royale)
--
-- Le jour J, la famille montre le QR de sa carte, quelqu'un scanne à
-- l'entrée : `checked_in_at` marque l'arrivée réelle, distincte de la
-- confirmation RSVP donnée des semaines avant.
--
-- Rejouable : `if not exists`, comme les migrations précédentes.

alter table guests add column if not exists checked_in_at timestamptz;
