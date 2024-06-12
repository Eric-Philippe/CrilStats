# -*- coding: utf-8 -*-
import json
import psycopg2
from psycopg2 import sql

# Configuration de la base de données
DB_USERNAME = 'postgres'
DB_PASSWORD = 'postgres'
DB_DATABASE = 'crilstats'
DB_PORT = '5432'
DB_HOST = 'localhost'

# Charger les données JSON
with open('../events.json', 'r', encoding='utf-8') as f:
    events = json.load(f)

with open('../students.json', 'r', encoding='utf-8') as f:
    students = json.load(f)

# Connexion à la base de données PostgreSQL
conn = psycopg2.connect(
    dbname=DB_DATABASE,
    user=DB_USERNAME,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)

# Empty the tables

cursor = conn.cursor()

cursor.execute('DELETE FROM Register')
cursor.execute('DELETE FROM Student')
cursor.execute('DELETE FROM Slot')

# Insérer les données dans la table Slot
for event in events:
    eventType = "Other"
    if event['type'] == 1:
        eventType = "Activité"
    elif event['type'] == 5:
        eventType = "Coaching"
        
    eventLevel = "Tous niveaux"
    if event['niveau'] == 1:
        eventLevel = "Débutant"
    elif event['niveau'] == 2:
        eventLevel = "Intermédiaire"
    elif event['niveau'] == 3:
        eventLevel = "Avancé"
        
    cursor.execute('''
        INSERT INTO Slot (slot_id, title, start_date, end_date, type, langue, niveau, dist, lieu, seats, insc, hidden)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slot_id) DO UPDATE SET
            title = EXCLUDED.title,
            start_date = EXCLUDED.start_date,
            end_date = EXCLUDED.end_date,
            type = EXCLUDED.type,
            langue = EXCLUDED.langue,
            niveau = EXCLUDED.niveau,
            dist = EXCLUDED.dist,
            lieu = EXCLUDED.lieu,
            seats = EXCLUDED.seats,
            insc = EXCLUDED.insc,
            hidden = EXCLUDED.hidden
    ''', (
        event['id'],
        event['title'],
        event['start'],
        event['end'],
        eventType,
        event['langue'],
        eventLevel,
        event['dist'],
        event['lieu'],
        event['quota']['seats'],
        event['quota']['insc'],
        event['hidden']
    ))

for student in students:
    cursor.execute('''
                   INSERT INTO Student (student_id, nom, prenom, annee, dpt, observations)
                   VALUES (%s, %s, %s, %s, %s, %s)
                     ON CONFLICT (student_id) DO UPDATE SET
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
                     INSERT INTO Register (sl_id, st_id, presence)
                     VALUES (%s, %s, %s)
                        ON CONFLICT (sl_id, st_id) DO UPDATE SET
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

print('Database populated successfully!')
