begin;

alter table accounts add column pin character varying(8);

commit;

