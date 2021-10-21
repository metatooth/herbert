begin;

alter table zones add column lamponleafdiff numeric default 0;
alter table zones add column lampoffleafdiff numeric default 0;

commit;
