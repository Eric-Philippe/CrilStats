CREATE TABLE Slot(
   id VARCHAR(50) PRIMARY KEY,
   title VARCHAR(255),
   start_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
   end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
   type VARCHAR(125) NOT NULL,
   langue VARCHAR(125),
   niveau VARCHAR(125),
   dist BOOLEAN,
   lieu VARCHAR(255),
   seats INT,
   insc INT,
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
   activiteid VARCHAR(50),
   userId VARCHAR(50),
   presence VARCHAR(155),
   PRIMARY KEY(activiteid, userId),
   FOREIGN KEY(activiteid) REFERENCES Slot(id),
   FOREIGN KEY(userId) REFERENCES Student(id)
);

CREATE OR REPLACE PROCEDURE InsertMultipleSlots(
    slot_data SLOT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    slot_record SLOT;
BEGIN
    FOREACH slot_record IN ARRAY slot_data
    LOOP
        INSERT INTO Slot (id, title, start_date, end_date, type, langue, niveau, dist, lieu, seats, insc, hidden)
        VALUES (slot_record.id, slot_record.title, slot_record.start_date, slot_record.end_date, slot_record.type, slot_record.langue, slot_record.niveau, slot_record.dist, slot_record.lieu, slot_record.seats, slot_record.insc, slot_record.hidden);
    END LOOP;
END;
$$;

