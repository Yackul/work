create table USERS (
UName VARCHAR(16) NOT NULL,
UEmail VARCHAR(24) NOT NULL,
PRIMARY KEY (UName)
);

create table REVIEW (
REVID INT(12) NOT NULL AUTO_INCREMENT,
REVNAME VARCHAR(24) NOT NULL,
CurrRev VARCHAR(40000) NOT NULL,
DT VARCHAR(40) NOT NULL,
PRIMARY KEY (REVID)
);

CREATE TABLE WORKS_ON_REVIEWS (
REVIDREF INT(12),
UNameW VARCHAR(16),
FOREIGN KEY(UNameW) REFERENCES USERS(UName),
FOREIGN KEY(REVIDREF) REFERENCES REVIEW(REVID)
);

CREATE TABLE COMMENTS_ON_REVIEWS (
REVIDREF INT(12),
COMMID INT(12),
DT DATETIME NOT NULL,
COMM VARCHAR(1024),
UNameC VARCHAR(16),
PRIMARY KEY(COMMID),
FOREIGN KEY(REVIDREF) REFERENCES REVIEW(REVID),
FOREIGN KEY(UNameC) REFERENCES USERS(UName)
);

CREATE TABLE COMMITS (
CommID INT(12) NOT NULL AUTO_INCREMENT,
CommMessage VARCHAR(255),
CommAppro BOOLEAN NOT NULL DEFAULT '0',
DT DATETIME NOT NULL,
WhatRevID INT(12) NOT NULL,
UNameCom VARCHAR(16),
FOREIGN KEY(UNameCom) REFERENCES USERS(UName),
PRIMARY KEY(CommID),
FOREIGN KEY(WhatRevID) REFERENCES REVIEW(REVID)
);

CREATE TABLE COMMITS_ON_REVIEWS (
CommID INT(12),
REVID INT(12),
CommDT DATETIME NOT NULL,
CommDiff LONGBLOB,
FOREIGN KEY(CommID) REFERENCES COMMITS(CommID),
FOREIGN KEY(REVID) REFERENCES REVIEW(REVID)
);

CREATE TABLE ADMINS (
AID INT(12) NOT NULL AUTO_INCREMENT,
UserCount INT(6),
ReviewCount INT(6),
VisitCount INT(6),
MessageCount INT(6),
CommentCount INT(6),
PRIMARY KEY(AID)
);
