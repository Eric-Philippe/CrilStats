import dotenv from "dotenv";
dotenv.config();

import ScrapperCommands from "./ScrapperCommands";
/**
 * @file run.ts
 *
 * @commands
 * Webscraping the slots:
 * ```ts
 * const SLOTS = await SlotsFetcher.fetchAllSlots();
 * ```
 *
 * Saving the slots to a JSON file:
 * ```ts
 * SlotsFetcher.saveSlotsToJson(SLOTS, "events");
 * ```
 *
 * Reading the slots from a JSON file:
 * ```ts
 * const JSON_SLOTS = await jsonReaderSlots("events");
 * ```
 *
 * Removing hidden slots and langue that are AUTRES:
 * ```ts
 * const FILTERED_SLOTS = JSON_SLOTS.filter(
 *  (slot) => !slot.hidden && slot.langue !== SlotLangue.AUTRES
 * );
 *
 * Get a set of unique DD/MM dates from the slots:
 * ```ts
 * const dateSet = SlotsFetcher.getSetDate(FILTERED_SLOTS);
 * ```
 *
 * Webscraping the students attendance:
 * ```ts
 * const students = await AttendanceFetcher.fectAllSudentsAttendance(dateSet);
 * ```
 *
 * Saving the students attendance to a JSON file:
 * ```ts
 * AttendanceFetcher.saveStudentsToJson(students, "students");
 * ```
 *
 * Reading the students attendance from a JSON file:
 * ```ts
 * const students = await jsonReaderStudents("students");
 * ```
 */
(async () => {
  try {
    const SLOTS = await ScrapperCommands.fetchAllSlots();
    ScrapperCommands.saveSlotsToJson(SLOTS, "events");
    console.log(SLOTS.length);

    const setDate = ScrapperCommands.getSetDate(SLOTS);

    const students = await ScrapperCommands.fetchAllStudentsAttendance(setDate);
    ScrapperCommands.saveStudentsToJson(students, "students");
  } catch (error) {
    console.error(error);
  }

  process.exit();
})();
