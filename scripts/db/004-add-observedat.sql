begin;

alter table readings add column observedat timestamp;
alter table statuses add column observedat timestamp;

commit;
