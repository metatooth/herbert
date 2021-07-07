begin;

alter table zones add column active boolean default true;
alter table zones add column activatedat timestamp default CURRENT_TIMESTAMP;

commit;
