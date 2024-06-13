import dotenv from "dotenv";
dotenv.config();

const DATA_ORIGIN = process.env.DATA_ORIGIN as string;
const SAVE_DATA = process.env.SAVE_DATA as string;
const URL_ACTIVITE = process.env.URL_ACTIVITE as string;
const URL_COACHING = process.env.URL_COACHING as string;
const URL_ATTENDANCE = process.env.URL_ATTENDANCE as string;
const EXECUTABLE_PATH = process.env.GOOGLE_EXECUTABLE_PATH as string;
const LOGIN = process.env.LOGIN as string;
const PASSWORD = process.env.PASSWORD as string;
const MAX_TABS = parseInt(process.env.MAX_TABS as string);

if (
  !DATA_ORIGIN ||
  !SAVE_DATA ||
  !URL_ACTIVITE ||
  !URL_COACHING ||
  !URL_ATTENDANCE ||
  !EXECUTABLE_PATH ||
  !LOGIN ||
  !PASSWORD ||
  !MAX_TABS
) {
  throw new Error("Missing URL in environment variables");
}

export {
  DATA_ORIGIN,
  SAVE_DATA,
  URL_ACTIVITE,
  URL_COACHING,
  URL_ATTENDANCE,
  EXECUTABLE_PATH,
  LOGIN,
  PASSWORD,
  MAX_TABS,
};
