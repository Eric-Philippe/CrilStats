# 💥 CrilStatsFusion-Analysis

## Introduction

This project is a complete tool to scrap and analyze the data from the ResaCril booking Website.
The main idea of this project is to provide a **reuseable** and **scalable** tool to write only one time the analysis, and having the possibilities to run the scrapper whenever we want to update the data and keep the analysis up-to-date.
The project is divided into 3 parts:

- 🏢 The Web-Scrapping part, that will scrap the data from the website and store it in a database. (`CrilScrapper/`)
- 🗒️ A **Jupyter Python SQL** Playbook that contains the full analysis of the data. (`playbook.ipynb`)
- 💻 An interface to interact with the scrapper and make all the complex setup seamless. (`CrilStatsFusion/`) - IN PROGRESS

## Table of Contents

## Cril Scrapper - Web Scrapping

The Cril Scrapper allow to fetch data from the ResaCril website and store the data in either **Json file**, **CSV file** or **PostgreSQL database**.

### Fetched URLs

| Title               | URL                     | Description                                       |
| ------------------- | ----------------------- | ------------------------------------------------- |
| Activities List     | `listeActivite/{month}` | Fetch the list of activities for a specific month |
| Coachings List      | `listeCoaching/{month}` | Fetch the list of coachings for a specific month  |
| Attendance Tracking | `suiviPresence/{date}`  | Fetch the attendance tracking for a specific date |

### Data fetched - Format

The scrapper fetches two types of data: **Slots** and **Student Attendance**.

#### Slots

The slots are the main object scrapped containing the information about all the slots offered by the ResaCril website.

```json
{
    "hidden": boolean, // If the slot is hidden to the public
    "title": string, // The title of the slot
    "start": string, // The start date of the slot
    "end": string, // The end date of the slot, allows to calculate the duration of the slot
    "id": string, // The id of the slot (unicity key)
    "color": string, // The color of the slot (don't know yet how it's used)
    "type": int, // The type of the slot (1. Activity, 5. Coaching)
    "langue": string, // The language of the slot (AN. English, ES. Spanish)
    "niveau": int, // The level of the slot (0. ll levels 1. Beginner, 2. Intermediate, 3. Advanced)
    "dist": boolean, // If the slot is a remote slot
    "lieu": string, // The location of the slot
    "quota": {
        "seats": int, // The number of seats available
        "insc": int // The number of people registered
    },
    "inscrits": [ // The list of people registered, only the name and first name are stored in the website
        {
            "nom": string, // The name of one person registered
            "prenom": string, // The first name of one person registered
        },
        ...
    ]
}
```

#### Student Attendance

The student attendance is an object scrapped containing the information about the student attendance for a specific slot.
We can later extract the student information, making it unique, and the link between the student and the slot.

```json
{
    "nom": string, // The name of the student
    "prenom": string, // The first name of the student
    "userId": string, // The id of the student
    "annee": string, // The current school year of the student "1A, 2A or 3A"
    "dpt": string, // The department of the student "GCCD"
    "observations": string, // The observations of the student
    "presence": string, // The presence of the student "Validé, Absence justifiée, Absence injustifiée, Fiche Moodle à reprendre, Fiche Moodle à faire"
    "activiteid": string, // The id of the activity
}

```

The `annee` and `dpt` fields are a single field that I split into two fields in the code to make it more readable.
Example: `BUT 1A CHIMIE` is split into `annee: "1", dpt: "CHIMIE"`

## Database

The database that receives the data is a PostgreSQL database. The database schema is the following:

```sql
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
```

## Playbook

The playbook is a Jupyter Notebook that contains the full analysis of the data. Go check the `playbook.ipynb` file to see the full analysis.

A full launched and exported playbook is available in the `playbook.html` file !

The special thing about this playbook is that it is **scalable** and **reusable** as it uses Python/SQL to interact with the database and make the analysis from it. It allows to put the focus on writing the SQL directly instead of writing Python code to interact to make the relationship between the data.

## CrilStatsFusion

The CrilStatsFusion is an interface that allows to interact with the scrapper and make all the complex setup seamless.
WORK IN PROGRESS

## Docker

The whole project is dockerized, and you can run the project with the following command:

```bash
docker-compose up -d
```
