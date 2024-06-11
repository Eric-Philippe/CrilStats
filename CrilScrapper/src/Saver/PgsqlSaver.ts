import fs from "fs";
import { promisify } from "util";
import { exec } from "child_process";

import Slot from "../SlotScrapped";
import StudentAttendance from "../StudentAttendanceScrapped";
import { JsonSaver } from "./JsonSaver";

const execPromise = promisify(exec);

/**
 * Class to save slots and students to a PostgreSQL database
 * @extends JsonSaver
 * @class
 */
export class PgsqlSaver extends JsonSaver {
  private static async saveSlotsToJsonTemp(slots: Slot[]): Promise<void> {
    await super.saveSlotsToJson(slots, "temp_slots");
  }

  private static async saveStudentsToJsonTemp(
    students: StudentAttendance[]
  ): Promise<void> {
    await super.saveStudentsToJson(students, "temp_students");
  }

  private static async deleteFiles(): Promise<void> {
    fs.unlinkSync("temp_slots.json");
    fs.unlinkSync("temp_students.json");
  }

  static async saveToBd(
    slots: Slot[],
    students: StudentAttendance[]
  ): Promise<void> {
    await PgsqlSaver.saveSlotsToJsonTemp(slots);
    await PgsqlSaver.saveStudentsToJsonTemp(students);

    try {
      // Execute the python script to populate the database
      const { stdout, stderr } = await execPromise(
        "python3 scripts/python/populate_db.py"
      );

      // Display standard output and error output
      console.log(`stdout: ${stdout}`);
      if (stderr) console.error(`stderr: ${stderr}`);
    } catch (error) {
      console.error(`Error during execution : ${error}`);
    }

    // Delete temp files
    await PgsqlSaver.deleteFiles();
  }
}
