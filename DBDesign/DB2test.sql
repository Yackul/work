create table USERS (
UName VARCHAR(160) NOT NULL,
UEmail VARCHAR(24) NOT NULL,
PRIMARY KEY (UName)
);

create table PROJECT (
PID INT(12) NOT NULL AUTO_INCREMENT,
PROJNAME VARCHAR(24) NOT NULL,
DT VARCHAR(40) NOT NULL,
PRIMARY KEY (PID)
);

CREATE TABLE FILES_IN_PROJ (
FID INT(12) NOT NULL AUTO_INCREMENT,
FNAME VARCHAR(40),
FTYPE VARCHAR(10),
FCONTENT LONGBLOB,
DT VARCHAR(40),
PIDREF INT(12),
FSTATUS INT(2),
FOREIGN KEY(PIDREF) REFERENCES PROJECT(PID),
primary key(FID)
);

CREATE TABLE WORKS_ON_PROJECTS (
PIDREF INT(12),
UNameW VARCHAR(160),
PName VARCHAR(24),
FOREIGN KEY(UNameW) REFERENCES USERS(UName),
FOREIGN KEY(PIDREF) REFERENCES PROJECT(PID)
);

CREATE TABLE COMMENTS_ON_REVIEWS (
COMMID INT(12) NOT NULL AUTO_INCREMENT,
COMMENTINDEX INT(12) NOT NULL,
FIDREF INT(12),
PIDREF INT(12),
DT VARCHAR(40) NOT NULL,
COMM VARCHAR(1024),
UNameC VARCHAR(160),
PRIMARY KEY(COMMID),
FOREIGN KEY(FIDREF) REFERENCES FILES_IN_PROJ(FID),
FOREIGN KEY(PIDREF) REFERENCES PROJECT(PID),
FOREIGN KEY(UNameC) REFERENCES USERS(UName)
);

CREATE TABLE COMMITS (
CommID INT(12) NOT NULL AUTO_INCREMENT,
CommMessage VARCHAR(255),
CommAppro BOOLEAN NOT NULL DEFAULT '0',
DT VARCHAR(40) NOT NULL,
WhatRevID INT(12) NOT NULL,
UNameCom VARCHAR(160),
FOREIGN KEY(UNameCom) REFERENCES USERS(UName),
PRIMARY KEY(CommID),
FOREIGN KEY(WhatRevID) REFERENCES PROJECT(PID)
);

CREATE TABLE INVITE_TO_REV (
RIID INT(12) NOT NULL AUTO_INCREMENT,
FIDREF INT(12),
PIDREF INT(12),
DIDREF INT(12),
RIUNAME VARCHAR(160),
RFUNAME VARCHAR(160),
DT VARCHAR(40),
FileName VARCHAR(40),
ACCEPTED BOOLEAN NOT NULL DEFAULT '0',
APPROVAL INT(2),
FOREIGN KEY(RIUNAME) REFERENCES USERS(UName),
FOREIGN KEY(RFUNAME) REFERENCES USERS(UName),
PRIMARY KEY(RIID)
);

CREATE TABLE DIFFS_ON_FILES (
DID INT(12) NOT NULL AUTO_INCREMENT,
CREATEDBY VARCHAR(160),
FIDREF INT(12),
CommDT VARCHAR(40) NOT NULL,
CommDiff LONGBLOB,
APPROVED INT(2),
PRIMARY KEY(DID)
);

CREATE TABLE PROJ_HIST (
HID INT(12) NOT NULL AUTO_INCREMENT,
PIDREF INT(12),
FIDREF INT(12),
DT VARCHAR(40),
FSTATUS INT(2),
FCONT LONGBLOB,
PRIMARY KEY(HID)
);

CREATE TABLE INVITES (
IID INT(12) NOT NULL AUTO_INCREMENT,
IREVID INT(12),
IUNAME VARCHAR(160),
FUNAME VARCHAR(160),
DT VARCHAR(40),
ProjName VARCHAR(40),
ACCEPTED BOOLEAN NOT NULL DEFAULT '0',
FOREIGN KEY(IUNAME) REFERENCES USERS(UName),
FOREIGN KEY(FUNAME) REFERENCES USERS(UName),
FOREIGN KEY(IREVID) REFERENCES PROJECT(PID),
PRIMARY KEY(IID)
);
