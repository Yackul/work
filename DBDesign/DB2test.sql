create table USERS (
UID INT(12) NOT NULL AUTO_INCREMENT,
UPW VARCHAR(16) NOT NULL,
UName VARCHAR(16) NOT NULL,
UEmail VARCHAR(24) NOT NULL,
URevCnt INT(3),
SentMessHist LONGBLOB,
RecvMessHist LONGBLOB,
PRIMARY KEY (UID)
);

create table REVIEW (
REVID INT(12) NOT NULL AUTO_INCREMENT,
RevUserCnt INT(3) NOT NULL,
RevMessages LONGBLOB,
CurrRev LONGBLOB NOT NULL,
DT DATETIME NOT NULL,
PRIMARY KEY (REVID)
);

CREATE TABLE WORKS_ON (
REVIDREF INT(12),
UIDREF INT(12),
FOREIGN KEY(REVIDREF) REFERENCES REVIEW(REVID),
FOREIGN KEY(UIDREF) REFERENCES USERS(UID)
);

CREATE TABLE COMMITS (
CommID INT(12) NOT NULL AUTO_INCREMENT,
CommMessage VARCHAR(255),
CommAppro BOOLEAN NOT NULL DEFAULT '0',
CommDiff LONGBLOB,
DT DATETIME NOT NULL,
WhatRevID INT(12) NOT NULL,
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
