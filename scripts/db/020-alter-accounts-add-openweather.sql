begin;

alter table accounts add column openweather char(32);
alter table accounts add column cityname varchar(256);
alter table accounts add column statecode varchar(256);

commit;
