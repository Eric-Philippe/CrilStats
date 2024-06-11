import puppeteer, { Browser, Page } from "puppeteer";

const ARGS = ["--no-sandbox", "--disable-setuid-sandbox"];

const URL_ACTIVITE = process.env.URL_ACTIVITE as string;
const URL_COACHING = process.env.URL_COACHING as string;
const URL_ATTENDANCE = process.env.URL_ATTENDANCE as string;
const EXECUTABLE_PATH = process.env.GOOGLE_EXECUTABLE_PATH as string;
const LOGIN = process.env.LOGIN as string;
const PASSWORD = process.env.PASSWORD as string;

const AUTHENTIFICATION_PORTAL = "Authentication portal";

if (!URL_ACTIVITE || !URL_COACHING || !URL_ATTENDANCE) {
  throw new Error("Missing URL in environment variables");
}

if (!EXECUTABLE_PATH) {
  throw new Error("Missing google executable path in environment variables");
}

if (!LOGIN || !PASSWORD) {
  throw new Error("Missing login or password in environment variables");
}

/**
 * @class ResacrilSession
 * @description Class to handle the session with the Resacril website
 *
 * Allows to share a single Puppeteer browser instance between multiple scrapers
 * with a need for a session only once
 */
export default class ResacrilSession {
  static URL_ACTIVITE = URL_ACTIVITE;
  static URL_COACHING = URL_COACHING;
  static URL_ATTENDANCE = URL_ATTENDANCE;

  private browser: Browser | null = null;
  private isConnected: boolean = false;

  /**
   * @constructor ResacrilSession
   * @description Create a new ResacrilSession
   * @warning Do not forget to call `initialize()` method before using the session
   * @warning Do not forget to call `login()` method before using the session
   */
  constructor() {}

  /**
   * Initialize the browser
   * @param debug - If true, the browser will be visible
   */
  async initialize(debug: boolean = false) {
    this.browser = await puppeteer.launch({
      headless: !debug,
      executablePath: EXECUTABLE_PATH,
      args: ARGS,
    });
  }

  /**
   * Login to the Resacril website and open a session
   */
  async login() {
    if (!this.isInitalized()) throw new Error("browser not initialized");

    const page = await this.browser?.newPage();
    await page?.goto(URL_ACTIVITE);

    const pageTitle = (await page?.title())?.toLocaleLowerCase();

    if (pageTitle === AUTHENTIFICATION_PORTAL.toLocaleLowerCase()) {
      await page?.type('input[name="user"]', LOGIN);
      await page?.type('input[name="password"]', PASSWORD);
      await page?.click('button[type="submit"]');

      await page?.waitForSelector("body");

      await page?.close();

      this.isConnected = true;
    } else this.isConnected = true;
  }

  async openNewPage(url: string): Promise<Page> {
    await this.isSessionReady();

    const page = await this.browser?.newPage();
    page?.setDefaultNavigationTimeout(60 * 1000);
    await page?.goto(url);

    if (page === undefined) throw new Error("Page not found");

    return page;
  }

  private async isSessionReady() {
    if (!this.isInitalized())
      throw new Error(
        "browser not initialized, please use `initialize()` method first"
      );
    if (!this.isConnected)
      throw new Error("Not connected, please use `login()` method first");

    return true;
  }

  /**
   * @returns true if the browser is initialized
   */
  async isInitalized() {
    return this.browser !== null;
  }

  async close(): Promise<void> {
    return new Promise((resolve) => {
      this.browser?.close().then(() => resolve());
    });
  }
}
