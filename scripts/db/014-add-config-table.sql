begin;

create table worker_config (
  nickname varchar(255) unique,
  config jsonb not null unique,
  createdat timestamp default current_timestamp,
  updatedat timestamp default current_timestamp,
  deleted boolean default false,
  deletedat timestamp,
  primary key (nickname, config)
);

insert into worker_config (nickname, config)
  values ('default', '{"devices":[]}');

commit;
