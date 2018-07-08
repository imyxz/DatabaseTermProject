create table secretary (
  id integer AUTO_INCREMENT,
  name varchar(64),
  sex enum('male','female','secret') default 'secret',
  age integer,
  hired_time datetime,
  end_time datetime,
  primary key (id)
);
create table laboratory (
  name varchar(64),
  instruction text,
  sec_id integer default null,
  foreign key (sec_id) REFERENCES secretary(id),
  primary key (name)
);
create index laboratory_sec_id on laboratory (sec_id);
create table room (
  id integer AUTO_INCREMENT,
  area decimal(10,2),
  address text,
  lab_name varchar(64) default null,
  foreign key (lab_name) REFERENCES laboratory(name),
  primary key (id)
);
create index room_laboratory_name on room (lab_name);
create table researcher (
  id integer AUTO_INCREMENT,
  name varchar(64),
  sex enum('male','female', 'secret') default 'secret',
  age integer,
  title varchar(64),
  major varchar(64),
  lab_name varchar(64),
  foreign key (lab_name) REFERENCES laboratory(name),
  primary key (id)
);
create index researcher_laboratory_name on researcher (lab_name);
create table work (
  id integer AUTO_INCREMENT,
  dead_line datetime,
  money decimal(10,2),
  requirement text,
  primary key (id)
);
create table outer_person(
  id integer AUTO_INCREMENT,
  name varchar(64),
  office_phone varchar(20),
  telephone varchar(20),
  email varchar(64),
  primary key (id)
);
create table organization(
  id integer AUTO_INCREMENT,
  name varchar(64),
  address text,
  incharger_id integer,
  foreign key (incharger_id) REFERENCES outer_person(id),
  primary key(id)
);
create table project(
  id integer AUTO_INCREMENT,
  name varchar(64),
  research_content text,
  money decimal(10,2),
  start_time datetime,
  dead_line datetime,
  principal_id integer,
  checker_id integer,
  foreign key (principal_id) REFERENCES organization(id),
  foreign key (checker_id) REFERENCES organization(id),
  primary key (id) 
);
create table achievement(
  id integer AUTO_INCREMENT,
  name varchar(64),
  type enum('invention', 'utility' ,'design') default 'invention',
  time datetime,
  rank integer,
  project_id integer,
  foreign key (project_id) REFERENCES project(id),
  primary key (id)
);
create table director(
  lab_name varchar(64),
  researcher_id integer,
  work_start_time datetime,
  work_end_time datetime,
  primary key (lab_name,researcher_id),
  foreign key (lab_name) REFERENCES laboratory(name),
  foreign key (researcher_id) REFERENCES researcher(id)
);
create table work_researcher(
  researcher_id integer,
  work_id integer,
  work_time datetime,
  work_load text,
  money decimal(10,2),
  primary key (researcher_id, work_id),
  foreign key (researcher_id) REFERENCES researcher(id),
  foreign key (work_id) REFERENCES work(id)
);
create table project_work(
  project_id integer,
  work_id integer,
  primary key(project_id, work_id),
  foreign key (project_id) REFERENCES project(id),
  foreign key (work_id) REFERENCES work(id)
);
create table achievement_participant(
  achievement_id integer,
  researcher_id integer,
  primary key(achievement_id,researcher_id),
  foreign key (achievement_id) REFERENCES achievement(id),
  foreign key (researcher_id) REFERENCES researcher(id) 
);
create table project_partner(
  project_id integer,
  partner_id integer,
  primary key(project_id,partner_id),
  foreign key (project_id) REFERENCES project(id),
  foreign key (partner_id) REFERENCES organization(id) 
);
create table organization_contractor(
  organization_id integer,
  contractor_id integer,
  primary key(organization_id,contractor_id),
  foreign key (organization_id) REFERENCES organization(id),
  foreign key (contractor_id) REFERENCES outer_person(id) 
);