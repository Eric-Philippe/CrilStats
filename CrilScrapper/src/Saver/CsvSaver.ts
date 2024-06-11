// CsvSaver.ts
import fs from "fs";
import path from "path";
import { promisify } from "util";
import Slot from "../SlotScrapped";
import StudentAttendance from "../StudentAttendanceScrapped";

// Convert fs functions to promise-based versions
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);

/**
 * Class to save slots and students to CSV files
 * @class
 */
export class CsvSaver {
  private slotsFilePath: string;
  private studentsFilePath: string;
  private registerFilePath: string;
  private mergedFilePath: string;
  private BOM: string = "\ufeff"; // UTF-8 BOM

  constructor(outputDir: string) {
    this.slotsFilePath = path.join(outputDir, "slots.csv");
    this.studentsFilePath = path.join(outputDir, "students.csv");
    this.registerFilePath = path.join(outputDir, "register.csv");
    this.mergedFilePath = path.join(outputDir, "fusion.csv");
  }

  // Initialize CSV files with headers and BOM
  public async initializeFilesSlot() {
    try {
      // Create output directory if it doesn't exist asynchronously
      if (!fs.existsSync(this.slotsFilePath)) {
        fs.mkdirSync(path.dirname(this.slotsFilePath), { recursive: true });
      }
      // Initialize slots CSV
      await writeFile(
        this.slotsFilePath,
        `${this.BOM}id,title,start_date,end_date,type,langue,niveau,dist,lieu,seats,insc,hidden\n`,
        "utf8"
      );
    } catch (error) {
      console.error("Error initializing files:", error);
    }
  }

  // Initialize student CSV files with headers and BOM
  public async initializeFilesStudent() {
    try {
      // Initialize students CSV
      await writeFile(
        this.studentsFilePath,
        `${this.BOM}userId,nom,prenom,annee,dpt,observation\n`,
        "utf8"
      );

      // Initialize register CSV
      await writeFile(
        this.registerFilePath,
        `${this.BOM}activiteid,userId,presence\n`,
        "utf8"
      );
    } catch (error) {
      console.error("Error initializing files:", error);
    }
  }

  // Initialize merged CSV file with headers and BOM
  public async initializeMergedFile() {
    try {
      // Initialize merged CSV
      await writeFile(
        this.mergedFilePath,
        `${this.BOM}title,start_date,end_date,type,langue,niveau,dist,lieu,seats,insc,hidden,nom,prenom,annee,dpt,observations,presence\n`,
        "utf8"
      );
    } catch (error) {
      console.error("Error initializing files:", error);
    }
  }

  // Save slot data to CSV file
  async saveSlots(slots: Slot[]) {
    const lines = slots
      .map((slot) => {
        const startDateTimestamp = new Date(slot.start);
        const endDateTimestamp = new Date(slot.end);
        const type =
          slot.type === 1 ? "Activity" : slot.type === 5 ? "Coaching" : "Other";
        const niveau =
          slot.niveau === 0
            ? "Tous niveaux"
            : slot.niveau === 1
            ? "Débutant"
            : slot.niveau === 2
            ? "Intermédiaire"
            : "Avancé";

        return `${slot.id},${
          slot.title
        },${startDateTimestamp},${endDateTimestamp},${type},${
          slot.langue
        },${niveau},${slot.dist ? "Oui" : "Non"},${slot.lieu},${
          slot.quota.seats
        },${slot.quota.insc},${slot.hidden}\n`;
      })
      .join("");

    await appendFile(this.slotsFilePath, lines, "utf8");
  }

  // Save student data to CSV files
  async saveStudents(students: StudentAttendance[]) {
    // Prepare lines for students.csv
    const studentLines = students
      .map(
        (student) =>
          `${student.userId},${student.nom},${student.prenom},${student.annee},${student.dpt},${student.observation}\n`
      )
      .join("");

    // Prepare lines for register.csv
    const registerLines = students
      .map(
        (student) =>
          `${student.activiteid},${student.userId},${student.presence}\n`
      )
      .join("");

    // Write both sets of data to their respective files
    await Promise.all([
      appendFile(this.studentsFilePath, studentLines, "utf8"),
      appendFile(this.registerFilePath, registerLines, "utf8"),
    ]);
  }

  // Merge data from students, register, and slots CSV files
  async saveMergedData(slots: Slot[], students: StudentAttendance[]) {
    const mergedLines = [];

    for (const student of students) {
      const slot = slots.find(
        (slot) => slot.id.toString() === student.activiteid
      );

      if (slot) {
        const startDateTimestamp = new Date(slot.start);
        const endDateTimestamp = new Date(slot.end);
        const type =
          slot.type === 1 ? "Activity" : slot.type === 5 ? "Coaching" : "Other";
        const niveau =
          slot.niveau === 0
            ? "Tous niveaux"
            : slot.niveau === 1
            ? "Débutant"
            : slot.niveau === 2
            ? "Intermédiaire"
            : "Avancé";
        const fullLine = `${
          slot.title
        },${startDateTimestamp},${endDateTimestamp},${type},${
          slot.langue
        },${niveau},${slot.dist ? "Oui" : "Non"},${slot.lieu},${
          slot.quota.seats
        },${slot.quota.insc},${slot.hidden},${student.nom},${student.prenom},${
          student.annee
        },${student.dpt},${student.observation},${student.presence}\n`;

        mergedLines.push(fullLine);
      }
    }

    await appendFile(
      this.mergedFilePath,
      `${this.BOM}${mergedLines.join("")}`,
      "utf8"
    );
  }
}
