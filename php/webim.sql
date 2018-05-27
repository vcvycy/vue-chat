drop database if exists webim;
create database webim;
use webim;
create table msg(
  id  int auto_increment primary key,
  fromID int,
  toID int,
  ip   varchar(20),
  time int,
  isRead boolean default false,
  content longtext
);