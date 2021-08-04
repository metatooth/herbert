begin;

alter table profiles add column bloweractive numeric;
alter table profiles add column blowercycle numeric;
alter table profiles add column irrigationperday numeric;
alter table profiles add column irrigationduration numeric;

commit;
