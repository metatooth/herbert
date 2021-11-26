begin;

create table control_types (
  controltype varchar(255) primary key,
  createdat timestamp default current_timestamp,
  updatedat timestamp default current_timestamp,
  deleted boolean default false,
  deletedat timestamp
);

insert into control_types (controltype) values
  ('HI_LO'), ('TARGETS'), ('VPD');

alter table profiles add column controltype varchar(255)
  references control_types(controltype) not null default 'HI_LO';

commit;
