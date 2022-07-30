CREATE TABLE comments (username varchar(50), postID int, comment varchar(100));

CREATE TABLE posts (SectionID int PRIMARY KEY, username varchar(50), title varchar(100), hashtag1 varchar(50), hashtag2 varchar(50), hashtag3 varchar(50), hashtag4 varchar(50), image varchar(100), paragraph varchar(10000));

CREATE TABLE user (SSN int PRIMARY KEY, name varchar(50), surname varchar(50), age int, username varchar(50), password int);