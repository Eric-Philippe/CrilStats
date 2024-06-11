import AttendanceFetcher from "./Scrapper/AttendanceFetcher";
import SlotsFetcher from "./Scrapper/SlotsFetcher";
import Slot from "./SlotScrapped";
import { jsonReaderSlots, jsonReaderStudents } from "./Utils";
import { SlotLangue } from "./models/Slot";

export default class ScrapperCommands {
  /**
   * Says Hi
   */
  static saysHi() {
    console.log("Hi");
  }

  /**
   * Scrap all slots
   * @param debug - Set to true when debugging (headless)
   * @returns an array of Slot objects
   */
  static async fetchAllSlots(debug = false) {
    return await SlotsFetcher.fetchAllSlots(debug);
  }

  /**
   * Save slots to a JSON file
   * @param slots - An array of Slot objects
   * @param filename - The name of the file
   */
  static async saveSlotsToJson(slots: Slot[], filename: string) {
    SlotsFetcher.saveSlotsToJson(slots, filename);
  }

  /**
   * Read slots from a JSON file
   * @param filename - The name of the file
   * @returns an array of Slot objects
   */
  static async jsonReaderSlots(filename: string) {
    return await jsonReaderSlots(filename);
  }

  /**
   * Filter hidden slots and slots with langue AUTRES
   * @param slots - An array of Slot objects
   * @returns an array of Slot objects
   */
  static async filterSlots(slots: Slot[]) {
    return slots.filter(
      (slot) => !slot.hidden && slot.langue !== SlotLangue.AUTRES
    );
  }

  /**
   * Get a set of unique DD/MM dates from the slots
   * @param slots - An array of Slot objects
   * @returns a Set of unique dates
   */
  static getSetDate(slots: Slot[]) {
    return SlotsFetcher.getSetDate(slots);
  }

  /**
   * Fetch all students attendance
   * @param dateSet - A set of unique dates
   * @param debug - Set to true when debugging (headless)
   * @returns an array of StudentAttendance objects
   */
  static async fetchAllStudentsAttendance(dateSet: Set<number>, debug = false) {
    return await AttendanceFetcher.fectAllSudentsAttendance(dateSet, debug);
  }

  /**
   * Save students attendance to a JSON file
   * @param students - An array of StudentAttendance objects
   * @param filename  - The name of the file
   */
  static async saveStudentsToJson(students: any[], filename: string) {
    AttendanceFetcher.saveStudentsToJson(students, filename);
  }

  /**
   * Read students attendance from a JSON file
   * @param filename - The name of the file
   * @returns an array of StudentAttendance objects
   */
  static async jsonReaderStudents(filename: string) {
    return await jsonReaderStudents(filename);
  }
}
