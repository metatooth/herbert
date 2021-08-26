begin;

alter table workers add column config jsonb;
alter table workers add column configname varchar(255);

alter table workers
    add constraint worker_config_fk
    foreign key (config)
    references worker_config (config)
    on update CASCADE;

alter table workers
    add constraint worker_config_name_fk
    foreign key (configname)
    references worker_config (nickname)
    on update CASCADE;

commit;
