begin;

alter table devices add column temperature numeric;
alter table devices add column humidity numeric;
alter table devices add column pressure numeric;
alter table devices add column status varchar(80);

commit;
