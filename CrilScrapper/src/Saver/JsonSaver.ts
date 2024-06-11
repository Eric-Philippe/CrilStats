import fs from "fs";
import Slot from "../SlotScrapped";
import StudentAttendance from "../StudentAttendanceScrapped";

export class JsonSaver {
  /**
   * Save the slots to a JSON file
   * @param slots - Array of Slot objects
   * @param filename - Name of the file
   */
  static async saveSlotsToJson(slots: Slot[], filename: string): Promise<void> {
    if (!filename.endsWith(".json")) filename += ".json";
    const data = JSON.stringify(slots, null, 2);
    await fs.promises.writeFile(filename, data);
  }
  /**
   * Save the attendances to a JSON file
   * @param attendances - Array of Attendances objects
   * @param filename - Name of the file
   */
  static async saveStudentsToJson(
    attendances: StudentAttendance[],
    filename: string
  ): Promise<void> {
    if (!filename.endsWith(".json")) filename += ".json";
    const data = JSON.stringify(attendances, null, 2);
    await fs.promises.writeFile(filename, data);
  }
}
