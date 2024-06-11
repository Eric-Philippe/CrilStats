export default class Base64Utils {
  /**
   * Decode a base64 string
   * @param base64 - the base64 string to decode
   * @returns the decoded string
   */
  static decodeBase64(base64: string): string {
    return atob(base64);
  }

  /**
   * Encode a string to base64
   * @param str - the string to encode
   * @returns the encoded base64 string
   */
  static encodeBase64(str: string): string {
    return btoa(str);
  }

  /**
   * Encode a date to a string
   * @example encodeDate(new Date(2021, 1, 1)) => "01/02/2021"
   * @param date
   */
  static encodeDate(date: Date): string {
    const string = date.toLocaleDateString("fr-FR");
    return this.encodeBase64(string);
  }

  /**
   * Decode a date from a string
   * @example decodeDate("01/02/2021") => new Date(2021, 1, 1)
   * @param string
   */
  static decodeDate(string: string): Date {
    const decoded = this.decodeBase64(string);
    const [day, month, year] = decoded.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
}
