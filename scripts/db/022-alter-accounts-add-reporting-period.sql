begin;

alter table accounts add column reportingperiod integer not null default 60000;

commit;
