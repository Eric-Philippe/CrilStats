CREATE TABLE Slot(
   slot_id VARCHAR(50) PRIMARY KEY,
   title VARCHAR(255),
   start_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
   end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
   type VARCHAR(125) NOT NULL,
   langue VARCHAR(125),
   niveau VARCHAR(125),
   dist BOOLEAN,
   lieu VARCHAR(255),
   seats INT NOT NULL,
   insc INT NOT NULL, -- Redundant with the Register table, but useful for performance
   hidden BOOLEAN NOT NULL
);

CREATE TABLE Student(
   student_id VARCHAR(50) PRIMARY KEY,
   nom VARCHAR(255) NOT NULL,
   prenom VARCHAR(255),
   annee VARCHAR(2),
   dpt VARCHAR(155),
   observations TEXT
);

CREATE TABLE Register(
   sl_id VARCHAR(50) NOT NULL,
   st_id VARCHAR(50) NOT NULL,
   presence VARCHAR(155) NOT NULL,
   PRIMARY KEY(sl_id, st_id),
   FOREIGN KEY(sl_id) REFERENCES Slot(slot_id),
   FOREIGN KEY(st_id) REFERENCES Student(student_id)
);

CREATE VIEW FILTERED_SLOTS AS (
    SELECT * FROM Slot
    WHERE hidden <> true
    AND langue <> 'AUT'
);

CREATE VIEW FILTERED_REGISTERS AS (
    SELECT * FROM Register
    WHERE presence <> 'Rien'
);

CREATE VIEW MERGED AS (
    SELECT * FROM Student s
    INNER JOIN FILTERED_REGISTER r ON s.student_id = r.st_id
    INNER JOIN FILTERED_SLOTS sl ON r.sl_id = sl.slot_id
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
        INSERT INTO Slot (slot_id, title, start_date, end_date, type, langue, niveau, dist, lieu, seats, insc, hidden)
        VALUES (slot_record.id, slot_record.title, slot_record.start_date, slot_record.end_date, slot_record.type, slot_record.langue, slot_record.niveau, slot_record.dist, slot_record.lieu, slot_record.seats, slot_record.insc, slot_record.hidden);
    END LOOP;
END;
$$;

