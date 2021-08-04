begin;

alter table zones add column maxirrigators numeric not null default 3;

commit;
