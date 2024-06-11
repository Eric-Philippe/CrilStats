/**
 * @file Utils.ts
 * @folder src/webscrap
 *
 * @description Random tools for debugging and testing the webscraping process
 */

import fs from "fs";

import Slot from "./SlotScrapped";
import { SlotType } from "./models/Slot";
import {
  StudentAttendanceType,
  strToDpt,
  strToPresence,
} from "./models/StudentAttendance";
import StudentAttendance from "./StudentAttendanceScrapped";

/** ========================================================= */
/** ====================== @JSONSlotType =================== */
/** ======================================================= */
export type JSONSlotType = {
  title: string;
  start: string;
  end: string;
  id: number;
  color: number;
  type: number;
  langue: string;
  niveau: number;
  dist: boolean;
  lieu: string;
  quota: { seats: number; insc: number };
  inscrits: { nom: string; prenom: string }[];
  hidden: boolean;
};

/**
 * Convert a JSON file to a SlotType array
 * @param filename the filename to read
 * @returns a SlotType array
 */
export const jsonReaderSlots = async (filename: string): Promise<Slot[]> => {
  if (!filename.endsWith(".json")) filename += ".json";
  if (!fs.existsSync(filename))
    throw new Error(
      `File ${filename} does not exist, please generate it first`
    );

  const data = fs.readFileSync(filename, "utf8");
  const json: JSONSlotType[] = JSON.parse(data);

  // Convert JSONSlotType to SlotType
  const slots: SlotType[] = json.map((slot) => {
    return {
      title: slot.title,
      start: new Date(slot.start),
      end: new Date(slot.end),
      id: slot.id,
      color: slot.color,
      type: slot.type,
      langue: Slot.getSlotLangue(slot.langue),
      niveau: Slot.getSlotNiveau(slot.niveau),
      dist: slot.dist,
      lieu: slot.lieu,
      quota: slot.quota,
      inscrits: slot.inscrits,
      hidden: slot.hidden,
    };
  });

  const slotsObj = slots.map((slot) => new Slot(slot));

  return slotsObj;
};

/** ======================================================================= */
/** ====================== @JSONStudentsAttendanceType =================== */
/** ===================================================================== */
export type JSONStudentAttendanceType = {
  nom: string;
  prenom: string;
  userId: string;
  annee: string;
  dpt: string;
  observation: string;
  presence: string;
  activiteid: string;
};

export const jsonReaderStudents = async (
  filename: string
): Promise<StudentAttendance[]> => {
  if (!filename.endsWith(".json")) filename += ".json";
  if (!fs.existsSync(filename)) {
    throw new Error(
      `File ${filename} does not exist, please generate it first`
    );
  }

  const data = fs.readFileSync(filename, "utf8");
  const json: JSONStudentAttendanceType[] = JSON.parse(data);

  // Convert JSONStudentAttendanceType to StudentAttendanceType
  const students: StudentAttendanceType[] = json.map((student) => {
    return {
      nom: student.nom,
      prenom: student.prenom,
      userId: student.userId,
      annee: student.annee as "1A" | "2A" | "3A",
      dpt: strToDpt(student.dpt),
      observations: student.observation,
      presence: strToPresence(student.presence),
      activiteid: student.activiteid,
    };
  });

  const studentsObj = students.map((student) => new StudentAttendance(student));

  return studentsObj;
};

export const DEPARTMENTS = [
  ["GEA RANGUEIL", "GEAR"],
  ["GEA PONSAN", "GEAP"],
  ["CHIMIE"],
  ["GCCD"],
  ["GCGP"],
  ["GEII"],
  ["GMP"],
  ["INFOCOM"],
  ["INFORMATIQUE", "INFO"],
  ["MMI"],
  ["MP"],
  ["PEC"],
  ["TC TOULOUSE", "TCT"],
  ["TC", "TCC"],
];
