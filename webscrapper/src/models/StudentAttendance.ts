export enum StudentAttendancePresence {
  VALIDE,
  JUSTIFIED,
  UNJUSTIFIED,
  REDO_MOODLE,
  MOODLE_TODO,
  NOTHING,
}

export const strToPresence = (str: string): StudentAttendancePresence => {
  switch (str) {
    case "Validé":
      return StudentAttendancePresence.VALIDE;
    case "Absence justifiée":
      return StudentAttendancePresence.JUSTIFIED;
    case "Absence injustifiée":
      return StudentAttendancePresence.UNJUSTIFIED;
    case "Fiche Moodle à reprendre":
      return StudentAttendancePresence.REDO_MOODLE;
    case "Fiche Moodle à faire":
      return StudentAttendancePresence.MOODLE_TODO;
    default:
      return StudentAttendancePresence.NOTHING;
  }
};

export const presenceToStr = (presence: StudentAttendancePresence): string => {
  switch (presence) {
    case StudentAttendancePresence.VALIDE:
      return "Validé";
    case StudentAttendancePresence.JUSTIFIED:
      return "Absence justifiée";
    case StudentAttendancePresence.UNJUSTIFIED:
      return "Absence injustifiée";
    case StudentAttendancePresence.REDO_MOODLE:
      return "Fiche Moodle à reprendre";
    case StudentAttendancePresence.MOODLE_TODO:
      return "Fiche Moodle à faire";
    case StudentAttendancePresence.NOTHING:
      return "Rien";
  }
};

/**
 * Si l'intitulé contient exactement "WHITE_SPACE + INTITULÉ + WHITE_SPACE",
 * Penser à faire les lients entre les abbreviations et les intitulés pour les 3 cas
 * Penser à tout faire en minuscule
 */
export enum StudentAttendanceDpt {
  GEA_RANGUEIL,
  GEA_PONSAN,
  CHIMIE,
  GCCD,
  GCGP,
  GEII,
  GMP,
  INFOCOM,
  INFORMATIQUE,
  MMI,
  MP,
  PEC,
  TC_TOULOUSE,
  TC_CASTRES,
  OTHERS,
}

export const strToDpt = (str: string): StudentAttendanceDpt => {
  const lower = str.toLowerCase();

  switch (lower) {
    case "gear":
      return StudentAttendanceDpt.GEA_RANGUEIL;
    case "gea rangueil":
      return StudentAttendanceDpt.GEA_RANGUEIL;
    case "geap":
      return StudentAttendanceDpt.GEA_PONSAN;
    case "gea ponsan":
      return StudentAttendanceDpt.GEA_PONSAN;
    case "chimie":
      return StudentAttendanceDpt.CHIMIE;
    case "gccd":
      return StudentAttendanceDpt.GCCD;
    case "gcgp":
      return StudentAttendanceDpt.GCGP;
    case "geii":
      return StudentAttendanceDpt.GEII;
    case "gmp":
      return StudentAttendanceDpt.GMP;
    case "infocom":
      return StudentAttendanceDpt.INFOCOM;
    case "info":
      return StudentAttendanceDpt.INFORMATIQUE;
    case "informatique":
      return StudentAttendanceDpt.INFORMATIQUE;
    case "mmi":
      return StudentAttendanceDpt.MMI;
    case "mp":
      return StudentAttendanceDpt.MP;
    case "pec":
      return StudentAttendanceDpt.PEC;
    case "tc toulouse":
      return StudentAttendanceDpt.TC_TOULOUSE;
    case "tct":
      return StudentAttendanceDpt.TC_TOULOUSE;
    case "tc":
      return StudentAttendanceDpt.TC_CASTRES;
    case "tcc":
      return StudentAttendanceDpt.TC_CASTRES;
    default:
      return StudentAttendanceDpt.OTHERS;
  }
};

export const dptToStr = (dpt: StudentAttendanceDpt): string => {
  switch (dpt) {
    case StudentAttendanceDpt.GEA_RANGUEIL:
      return "GEA RANGUEIL";
    case StudentAttendanceDpt.GEA_PONSAN:
      return "GEA PONSAN";
    case StudentAttendanceDpt.CHIMIE:
      return "CHIMIE";
    case StudentAttendanceDpt.GCCD:
      return "GCCD";
    case StudentAttendanceDpt.GCGP:
      return "GCGP";
    case StudentAttendanceDpt.GEII:
      return "GEII";
    case StudentAttendanceDpt.GMP:
      return "GMP";
    case StudentAttendanceDpt.INFOCOM:
      return "INFOCOM";
    case StudentAttendanceDpt.INFORMATIQUE:
      return "INFORMATIQUE";
    case StudentAttendanceDpt.MMI:
      return "MMI";
    case StudentAttendanceDpt.MP:
      return "MP";
    case StudentAttendanceDpt.PEC:
      return "PEC";
    case StudentAttendanceDpt.TC_TOULOUSE:
      return "TC TOULOUSE";
    case StudentAttendanceDpt.TC_CASTRES:
      return "TC CASTRES";
    case StudentAttendanceDpt.OTHERS:
      return "OTHERS";
  }
};

export type StudentAttendanceType = {
  nom: string;
  prenom: string;
  userId: string;
  annee: "1A" | "2A" | "3A";
  dpt: StudentAttendanceDpt;
  observations: string;
  presence: StudentAttendancePresence;
  activiteid: string;
};
