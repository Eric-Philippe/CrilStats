import {
  StudentAttendanceDpt,
  StudentAttendancePresence,
  StudentAttendanceType,
  dptToStr,
  presenceToStr,
  strToDpt,
  strToPresence,
} from "./models/StudentAttendance";

/**
 * List of departments
 * @description List of departments to help convert the department string to the StudentAttendanceDpt enum
 */
const DEPARTMENTS = [
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

/**
 * @class StudentAttendance class
 * @description StudentAttendance class to represent a student attendance scrapped from the website
 * Possess a static method to convert every field that we want to save
 */
export default class StudentAttendance {
  public nom: string;
  public prenom: string;
  public userId: string;
  public annee: string;
  public dpt: string;
  public observation: string;
  public presence: string;
  public activiteid: string;

  public static stringToAttendanceType(str: string): StudentAttendanceType {
    const attendanceType: StudentAttendanceType = {
      nom: this.getNom(str),
      prenom: this.getPrenom(str),
      userId: this.getUserId(str),
      annee: this.getDptAndAnnee(str).year,
      dpt: this.getDptAndAnnee(str).dpt,
      observations: this.getObservations(str),
      presence: this.getPresence(str),
      activiteid: this.getActiviteId(str),
    };

    return attendanceType;
  }

  constructor(attendance: StudentAttendanceType) {
    this.nom = attendance.nom;
    this.prenom = attendance.prenom;
    this.userId = attendance.userId;
    this.annee = attendance.annee;
    this.dpt = dptToStr(attendance.dpt);
    this.observation = attendance.observations;
    this.presence = presenceToStr(attendance.presence);
    this.activiteid = attendance.activiteid;
  }

  public static getNom(str: string): string {
    // nom: <td>(.+?|)<\/td>
    const regex = /(?<=<td>).*?(?=<\/td>)/gm;
    const match = str.match(regex);
    if (match === null) return "";

    return match[3];
  }

  public static getPrenom(str: string): string {
    // prenom: <td>(.+?|)<\/td>
    const regex = /(?<=<td>).*?(?=<\/td>)/gm;
    const match = str.match(regex);
    if (match === null) return "";

    return match[4];
  }

  public static getUserId(str: string): string {
    // usagid="47568"
    const regex = /usagid="\d+"/gm;
    const match = str.match(regex);
    if (match === null) return "";

    return match[0].replace(/usagid="|"/g, "");
  }

  public static getDptAndAnnee(str: string): {
    dpt: StudentAttendanceDpt;
    year: "1A" | "2A" | "3A";
  } {
    // <td[^>]*>(\s*.*?\s*)<\/td>
    const regex = /<td[^>]*>(\s*.*?\s*)<\/td>/gm;
    const match = str.match(regex);
    if (match === null) return { dpt: StudentAttendanceDpt.OTHERS, year: "1A" };
    const text = match[7].trim();

    let year = "1A" as "1A" | "2A" | "3A";
    const matchYear = text.match(/1A|2A|3A/);
    if (matchYear !== null) year = matchYear[0] as "1A" | "2A" | "3A";

    let dpt = StudentAttendanceDpt.OTHERS;
    let found = false;

    for (const _dpt in DEPARTMENTS) {
      for (const department of DEPARTMENTS[_dpt]) {
        if (text.toLowerCase().includes(" " + department.toLowerCase())) {
          dpt = strToDpt(department);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    return { dpt, year };
  }

  public static getObservations(str: string): string {
    // <textarea .*?>(.*?)<\/textarea>
    const regex = /(?<=<textarea .*?>)(.*?)(\n|)(?=<\/textarea>)/gm;
    const match = str.match(regex);
    if (match === null) return "";

    return match[0].trim();
  }

  public static getPresence(str: string): StudentAttendancePresence {
    // <select name="presence"[^>]*>(?:\s*<[^>]*>)*\s*<option[^>]*\s*selected[^>]*>(.*?)<\/option>
    const regex = /<select name="presence" [\S\s]*?>[\S\s]*<\/select>/gm;

    const match = str.match(regex);

    if (match === null) return StudentAttendancePresence.NOTHING;

    const secondRegex =
      /(?<=<option value="\d" selected="">)(.+?)(?=<\/option>)/gm;
    const secondMatch = match[0].match(secondRegex);

    if (secondMatch === null) return StudentAttendancePresence.NOTHING;

    if (strToPresence(secondMatch[0]) != StudentAttendancePresence.NOTHING) {
      return strToPresence(secondMatch[0]);
    }

    return StudentAttendancePresence.NOTHING;
  }

  public static getActiviteId(str: string): string {
    const regex = /activiteid="\d+"/gm;
    const match = str.match(regex);
    if (match === null) return "";

    return match[0].replace(/activiteid="|"/g, "");
  }

  public toString(): string {
    return `${this.nom} ${this.prenom} ${this.userId} ${this.annee} ${this.dpt} ${this.observation} ${this.presence} ${this.activiteid}`;
  }
}
