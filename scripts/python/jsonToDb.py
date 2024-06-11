import json
import psycopg2
from psycopg2 import sql

"""
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

students.json:
  {
    "nom": "Allasia",
    "prenom": "Levi",
    "userId": "47336",
    "annee": "1A",
    "dpt": "INFORMATIQUE",
    "observation": "Excellent en coaching!",
    "presence": "Validé",
    "activiteid": "11444"
  },
"""

# Configuration de la base de données
DB_USERNAME = 'postgres'
DB_PASSWORD = 'postgres'
DB_DATABASE = 'crilstats'
DB_PORT = '5432'
DB_HOST = 'localhost'

# Charger les données JSON
with open('events.json', 'r') as f:
    events = json.load(f)

with open('students.json', 'r') as f:
    students = json.load(f)

# Connexion à la base de données PostgreSQL
conn = psycopg2.connect(
    dbname=DB_DATABASE,
    user=DB_USERNAME,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)
cursor = conn.cursor()

# Insérer les données dans la table Slot
for event in events:
    cursor.execute('''
        INSERT INTO Slot (id, title, start_date, end_date, type, langue, niveau, dist, lieu, seats, hidden)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            start_date = EXCLUDED.start_date,
            end_date = EXCLUDED.end_date,
            type = EXCLUDED.type,
            langue = EXCLUDED.langue,
            niveau = EXCLUDED.niveau,
            dist = EXCLUDED.dist,
            lieu = EXCLUDED.lieu,
            seats = EXCLUDED.seats,
            hidden = EXCLUDED.hidden
    ''', (
        event['id'],
        event['title'],
        event['start'],
        event['end'],
        event['type'],
        event['langue'],
        event['niveau'],
        event['dist'],
        event['lieu'],
        event['quota']['seats'],
        event['hidden']
    ))

for student in students:
    cursor.execute('''
                   INSERT INTO Student (id, nom, prenom, annee, dpt, observations)
                   VALUES (%s, %s, %s, %s, %s, %s)
                     ON CONFLICT (id) DO UPDATE SET
                          nom = EXCLUDED.nom,
                          prenom = EXCLUDED.prenom,
                          annee = EXCLUDED.annee,
                          dpt = EXCLUDED.dpt,
                          observations = EXCLUDED.observations
                   ''',
                     (
                          student['userId'],
                          student['nom'],
                          student['prenom'],
                          student['annee'],
                          student['dpt'],
                          student['observation']
                   )
    )
    
    cursor.execute('''
                     INSERT INTO Register (id, id_1, presence)
                     VALUES (%s, %s, %s)
                        ON CONFLICT (id, id_1) DO UPDATE SET
                              presence = EXCLUDED.presence
                     ''',
                     (
                          student['activiteid'],
                          student['userId'],
                          student['presence']
                     )
    )

# Valider les transactions
conn.commit()

# Fermer la connexion
cursor.close()
conn.close()
