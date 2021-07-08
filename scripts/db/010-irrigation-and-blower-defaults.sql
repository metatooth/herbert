begin;

update profiles set bloweractive = 180000, blowercycle = 180000, irrigationperday = 2, irrigationduration = 210000;

alter table profiles alter column bloweractive set default 180000;
alter table profiles alter column blowercycle set default 180000;
alter table profiles alter column irrigationperday set default 2;
alter table profiles alter column irrigationduration set default 210000;

alter table profiles alter column bloweractive set not null;
alter table profiles alter column blowercycle set not null;
alter table profiles alter column irrigationperday set not null;
alter table profiles alter column irrigationduration set not null;

commit;
