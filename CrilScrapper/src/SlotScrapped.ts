import { SlotLangue, SlotNiveau, SlotType } from "./models/Slot";

/**
 * @class Slot class
 * @description Slot class to represent a slot scrapped from the website
 * Possess a static method to convert every field that we want to save
 */
export default class Slot {
  static ACTIVITY_TYPE = 1;
  static COACHING_TYPE = 5;

  public title: string;
  public start: Date;
  public end: Date;
  public id: number;
  public color: number;
  public type: number;
  public langue: SlotLangue;
  public niveau: SlotNiveau;
  public dist: boolean;
  public lieu: string;
  public quota: { seats: number; insc: number };
  public inscrits: { nom: string; prenom: string }[];
  public hidden: boolean = false;

  /**
   * Class method to convert a string to a SlotType
   * @param event - The string to convert
   * @returns a SlotType object
   */
  public static stringToSlotType(event: string): SlotType {
    const slotType: SlotType = {
      title: Slot.getTitle(event),
      start: Slot.getDate(event, "start"),
      end: Slot.getDate(event, "end"),
      id: Slot.getId(event),
      color: Slot.getColor(event),
      type: Slot.getType(event),
      langue: Slot.getLangue(event),
      niveau: Slot.getNiveau(event),
      dist: Slot.getDist(event),
      lieu: Slot.getLieu(event),
      quota: Slot.getQuota(event),
      inscrits: Slot.getInscrits(event),
      hidden: Slot.getHidden(event),
    };

    return slotType;
  }

  constructor(event: SlotType) {
    this.title = event.title;
    this.start = event.start;
    this.end = event.end;
    this.id = event.id;
    this.color = event.color;
    this.type = event.type;
    this.langue = event.langue;
    this.niveau = event.niveau;
    this.dist = event.dist;
    this.lieu = event.lieu;
    this.quota = event.quota;
    this.inscrits = event.inscrits;
    this.hidden = event.hidden;
  }

  private static getTitle(event: string): string {
    // title: '(.+?)',
    const regex = /title: '([^']+)'/;
    const match = event.match(regex);
    if (match === null) return "";
    return match[1];
  }

  private static getDate(event: string, dateType: "start" | "end"): Date {
    // start: '(.+?)',
    const regex = new RegExp(`${dateType}: '(.+?)'`);
    const match = event.match(regex);
    if (match === null) return new Date();
    return new Date(match[1]);
  }

  private static getId(event: string): number {
    // id: (.+?),
    const regex = /id: (.+?),/;
    const match = event.match(regex);
    if (match === null) return 0;
    return parseInt(match[1]);
  }

  private static getColor(event: string): number {
    // color: eventColor\('(.+?)'
    const colorRegex = /color: eventColor\('(.+?)'/;
    const colorMatch = event.match(colorRegex);
    if (colorMatch === null) return 0;
    return parseInt(colorMatch[1]);
  }

  private static getHidden(event: string): boolean {
    // hidden: color: eventColor\('\d', (.+?)\),
    const regex = /color: eventColor\('\d', (.+?)\),/;
    const match = event.match(regex);
    if (match === null) return false;
    return match[1] === "true";
  }

  private static getType(event: string): number {
    // type: '(.+?)',
    const regex = /type: '(.+?)',/;
    const match = event.match(regex);
    if (match === null) return 0;
    return parseInt(match[1]);
  }

  private static getLangue(event: string): SlotLangue {
    // langue: '(.+?)',
    const regex = /langue: '(.+?)',/;
    const match = event.match(regex);
    if (match === null) return SlotLangue.ANGLAIS;
    return Slot.getSlotLangue(match[1]);
  }

  private static getNiveau(event: string): SlotNiveau {
    // niveau: (.+?),
    const regex = /niveau: (.+?),/;
    const match = event.match(regex);
    if (match === null) return SlotNiveau.TOUS_NIVEAUX;
    const niveauMatch = match[1];
    const niveau = niveauMatch === "null" ? null : parseInt(niveauMatch);
    return Slot.getSlotNiveau(niveau);
  }

  private static getDist(event: string): boolean {
    // dist: (.+?),
    const regex = /dist: (.+?),/;
    const match = event.match(regex);
    if (match === null) return false;
    return match[1] === "true";
  }

  private static getLieu(event: string): string {
    // lieu: '(.+?)',
    const regex = /lieu: '(.+?)',/;
    const match = event.match(regex);
    if (match === null) return "";
    return match[1];
  }

  private static getQuota(event: string): { seats: number; insc: number } {
    // quota: { seats: (.+?), insc: (.+?) },
    const regex = /quota: { seats: (.+?), insc: (.+?) },/;
    const match = event.match(regex);
    if (match === null) return { seats: 0, insc: 0 };
    return { seats: parseInt(match[1]), insc: parseInt(match[2]) };
  }

  private static getInscrits(event: string): { nom: string; prenom: string }[] {
    // \snom: '(.+?)'
    // \sprenom: '(.+?)'
    // Fill every match in an array
    const regexName = /\snom: '(.+?)'/g;
    const regexFirstname = /\sprenom: '(.+?)'/g;
    const names = event.match(regexName);
    const firstnames = event.match(regexFirstname);
    if (names === null || firstnames === null) return [];
    const inscrits = [];
    for (let i = 0; i < names.length; i++) {
      if (names[i] === undefined || firstnames[i] === undefined) continue;
      inscrits.push({
        nom: names[i].match(/nom: '(.+?)'/)![1],
        prenom: firstnames[i].match(/prenom: '(.+?)'/)![1],
      });
    }
    return inscrits;
  }

  public static getSlotLangue(langue: string): SlotLangue {
    switch (langue) {
      case "AN":
        return SlotLangue.ANGLAIS;
      case "FR":
        return SlotLangue.FRANCAIS;
      case "ES":
        return SlotLangue.ESPAGNOL;
      case "AUT":
        return SlotLangue.AUTRES;
      default:
        return SlotLangue.ANGLAIS;
    }
  }

  public static getSlotNiveau(niveau: number | null): SlotNiveau {
    if (niveau === null) return SlotNiveau.TOUS_NIVEAUX;
    switch (niveau) {
      case 1:
        return SlotNiveau.DEBUTANT;
      case 2:
        return SlotNiveau.INTERMEDIAIRE;
      case 3:
        return SlotNiveau.AVANCE;
      default:
        return SlotNiveau.TOUS_NIVEAUX;
    }
  }

  public toString(): string {
    return `Title: ${this.title}\nStart: ${this.start}\nEnd: ${this.end}\nId: ${this.id}\nColor: ${this.color}\nType: ${this.type}\nLangue: ${this.langue}\nNiveau: ${this.niveau}\nDist: ${this.dist}\nLieu: ${this.lieu}\nQuota: ${this.quota}\nInscrits: ${this.inscrits}`;
  }

  public toJson(): string {
    return JSON.stringify(this);
  }

  public equals(slot: Slot): boolean {
    // If the title and the start date and end date are the same, the slots are the same
    return (
      this.title === slot.title &&
      this.start.getTime() === slot.start.getTime() &&
      this.end.getTime() === slot.end.getTime()
    );
  }
}
