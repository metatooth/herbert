begin;

alter table workers add column config jsonb not null default '{"devices":[]}';

commit;
