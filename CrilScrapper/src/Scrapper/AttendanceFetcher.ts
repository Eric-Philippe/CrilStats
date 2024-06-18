import { Page } from "puppeteer";

import ResacrilSession from "../ResacrilSession";
import StudentAttendance from "../StudentAttendanceScrapped";
import Base64Utils from "../Base64Utils";

/**
 * @class AttendanceFetcher
 * @classdesc Fetch the attendance of all students
 * @static
 */
export default class AttendanceFetcher {
  /**
   * Fetch all students attendance
   * @warning This function calls a lot of pages and can be greedy in memory
   *
   * @param dateSet - Set of unique dates
   * @returns an array of StudentAttendance objects
   */
  static async fectAllSudentsAttendance(
    dateSet: Set<number>,
    debug = false // Set to true when debugging (headless)
  ): Promise<StudentAttendance[]> {
    // Final Array
    const students: StudentAttendance[] = [];

    // Initialize the session
    const resacril = new ResacrilSession();
    await resacril.initialize(debug);
    await resacril.login();

    /**
     * Iterate over the 12 months in order to avoid opening too many pages
     * the memory saved makes it still quicker than opening all pages at once
     */
    for (let i = 0; i < 12; i++) {
      const current_month_dateSet = new Set<Date>();
      dateSet.forEach((date) => {
        if (new Date(date).getMonth() === i) {
          current_month_dateSet.add(new Date(date));
        }
      });

      // Skip month without any date
      if (current_month_dateSet.size === 0) continue;

      const studentsMonth = await this.fectAllSudentsAttendanceMonth(
        current_month_dateSet,
        resacril
      );

      students.push(...studentsMonth);
    }

    await resacril.close();

    return students;
  }

  /**
   * Fetch all students attendance for a single month
   * @param dateSet The set of unique dates for the month
   * @param resacril The ResacrilSession object
   * @returns an array of StudentAttendance objects
   */
  static async fectAllSudentsAttendanceMonth(
    dateSet: Set<Date>,
    resacril: ResacrilSession
  ): Promise<StudentAttendance[]> {
    const promises = Array.from(dateSet, async (date) => {
      const encoded = Base64Utils.encodeDate(date);
      const page = await resacril.openNewPage(
        ResacrilSession.URL_ATTENDANCE + encoded
      );

      const students = await this.parseStudentsData(page);

      await page.close();

      return students;
    });

    const studentsArrays = await Promise.all(promises);
    const students = studentsArrays.flat();

    return students;
  }

  /**
   * Parse the students data from the page reading the html body
   * @param page - The page to read
   * @returns an array of StudentAttendance objects
   */
  private static async parseStudentsData(
    page: Page
  ): Promise<StudentAttendance[]> {
    const fullPageContent = await page.content();
    const regex = /<tr\s+role="row"\s+class="(even|odd)">[\s\S]*?<\/tr>/g;
    const studentsMatch = fullPageContent.match(regex);

    if (studentsMatch === null) return [];

    let students = studentsMatch.map((student) => {
      const el = StudentAttendance.stringToAttendanceType(student);
      const newStudent = new StudentAttendance(el);
      if (newStudent.nom == "") return null;

      return newStudent;
    });

    // Remove null values
    students = students.filter((student) => student !== null);

    return students as StudentAttendance[];
  }
}
