CREATE TABLE Slot(
   id VARCHAR(50) PRIMARY KEY,
   title VARCHAR(255),
   start_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
   end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
   type SMALLINT NOT NULL,
   langue VARCHAR(125),
   niveau SMALLINT,
   dist BOOLEAN,
   lieu VARCHAR(255),
   seats INT,
   hidden BOOLEAN
);

CREATE TABLE Student(
   id VARCHAR(50) PRIMARY KEY,
   nom VARCHAR(255) NOT NULL,
   prenom VARCHAR(255),
   annee VARCHAR(2),
   dpt VARCHAR(155),
   observations TEXT
);

CREATE TABLE Register(
   id VARCHAR(50),
   id_1 VARCHAR(50),
   presence VARCHAR(155),
   PRIMARY KEY(id, id_1),
   FOREIGN KEY(id) REFERENCES Slot(id),
   FOREIGN KEY(id_1) REFERENCES Student(id)
);
