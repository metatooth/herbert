begin;

alter table device_types add column ismeter boolean not null default false;

update device_types set ismeter = 'true' where devicetype = 'meter';

insert into device_types (devicetype, ismeter) values ('rangefinder', true);
insert into device_types (devicetype, ismeter) values ('switch', true);

commit;
