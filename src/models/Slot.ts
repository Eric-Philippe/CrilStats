export enum SlotLangue {
  ANGLAIS = "AN",
  FRANCAIS = "FR",
  ESPAGNOL = "ES",
  AUTRES = "AUT",
}

export enum SlotNiveau {
  TOUS_NIVEAUX = 0,
  DEBUTANT = 1,
  INTERMEDIAIRE = 2,
  AVANCE = 3,
}

export type SlotType = {
  title: string;
  start: Date;
  end: Date;
  id: number;
  color: number;
  type: number;
  langue: SlotLangue;
  niveau: SlotNiveau;
  dist: boolean;
  lieu: string;
  quota: { seats: number; insc: number };
  inscrits: { nom: string; prenom: string }[];
  hidden: boolean;
};
