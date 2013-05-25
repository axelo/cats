# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table cat (
  id                        bigint not null,
  name                      varchar(255),
  comment                   varchar(255),
  score                     integer,
  picture_url               varchar(255),
  constraint pk_cat primary key (id))
;

create sequence cat_seq;




# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists cat;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists cat_seq;

