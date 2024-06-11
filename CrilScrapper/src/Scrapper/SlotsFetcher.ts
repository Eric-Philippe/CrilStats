import { Page } from "puppeteer";

import ResacrilSession from "../ResacrilSession";
import Slot from "../SlotScrapped";
import { SlotType } from "../models/Slot";

export default class SlotsFetcher {
  /**
   * Fetch all slots from the Resacril website
   * @returns {Promise<Slot[]>} - Array of Slot objects
   */
  static async fetchAllSlots(debug = false): Promise<Slot[]> {
    const activities = await this.fetchActivities(debug);
    const coachings = await this.fetchCoachings(debug);

    return activities.concat(coachings);
  }

  /**
   * Fetch all activities from the Resacril website
   * @returns {Promise<Slot[]>} - Array of Slot objects
   */
  static async fetchActivities(debug = false): Promise<Slot[]> {
    const resacril = new ResacrilSession();
    await resacril.initialize(debug);
    await resacril.login();

    const promises = Array.from({ length: 12 }, async (_, i) => {
      const page = await resacril.openNewPage(
        ResacrilSession.URL_ACTIVITE + "/" + (i + 1)
      );
      const slots = await this.parseSlotsData(page);

      await page.close();

      return slots;
    });

    const eventsArrays = await Promise.all(promises);

    resacril.close();

    return this.cleanUpEvents(eventsArrays);
  }

  /**
   * Fetch all coachings from the Resacril website
   * @returns {Promise<Slot[]>} - Array of Slot objects
   */
  static async fetchCoachings(debug = false): Promise<Slot[]> {
    const resacril = new ResacrilSession();
    await resacril.initialize(debug);
    await resacril.login();

    const promises = Array.from({ length: 12 }, async (_, i) => {
      const page = await resacril.openNewPage(
        ResacrilSession.URL_COACHING + "/" + (i + 1)
      );
      const slots = await this.parseSlotsData(page);

      await page.close();

      return slots;
    });

    const eventsArrays = await Promise.all(promises);

    resacril.close();

    return this.cleanUpEvents(eventsArrays);
  }

  /**
   * Generic method to assemble all the monthes slots together and remove duplicates
   * @param events - Array of Array of Slot objects
   * @returns {Slot[]} - Array of Slot objects
   */
  private static cleanUpEvents(events: Slot[][]): Slot[] {
    let reducedEvents = events.reduce((acc, curr) => acc.concat(curr), []);

    // Remove duplicates
    const seen = new Set();
    reducedEvents = reducedEvents.filter((event) => {
      const duplicate = seen.has(event.id);
      seen.add(event.id);
      return !duplicate;
    });

    return reducedEvents;
  }

  /**
   * Convert the HTML Resacril slot data to Slot objects
   * @param page Current page
   * @returns {Promise<Slot[]>} - Array of Slot objects
   */
  private static async parseSlotsData(page: Page): Promise<Slot[]> {
    const fullPageContent = await page.content();
    const startIndex = fullPageContent.indexOf("events: [");
    const endIndex = fullPageContent.indexOf("slotLabelFormat: 'HH:mm'");
    const pageContent = fullPageContent.slice(startIndex, endIndex - 1);

    const regex = /\{\s*title: ([^}]+?)\n[\s\S]*?recurr:\s*\d+\s*\}/g;
    const eventsMatch = pageContent.match(regex);

    if (eventsMatch === null) return [];

    const events: Slot[] = eventsMatch.map((event: string) => {
      return new Slot(Slot.stringToSlotType(event));
    });

    return events;
  }

  /**
   * Returns a set of date regardless of the time
   * @param slots - Array of Slot objects
   * @returns {Set<Date>} - Set of Date objects
   */
  static getSetDate(slots: SlotType[]): Set<number> {
    const dates = new Set<number>();
    slots.forEach((slot) => {
      const date = new Date(slot.start);
      date.setHours(0, 0, 0, 0);
      dates.add(date.getTime());
    });

    return dates;
  }
}
