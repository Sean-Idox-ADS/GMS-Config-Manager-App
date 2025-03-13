//#region header */
/**************************************************************************************************
//
//  Description: All the helper utilities used by the application.
//
//  Copyright:    © 2025 Idox Software Limited
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
//#region Version 1.0.0.0 changes
//    001   21.02.25 Sean Flook          GMSCM-1 Initial Revision.
//    002   25.02.25 Sean Flook          GMSCM-1 Added FormatDate.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

import { encode } from "iso-8859-14";
import ObjectComparison from "./ObjectComparison";

export enum CharacterSet {
  None,
  GeoPlaceProperty1,
  GeoPlaceProperty2,
  GeoPlaceAZOnly,
  GeoPlaceStreet1,
  GeoPlaceStreet2,
  OneScotlandProperty,
  OneScotlandStreet,
  OneScotlandLookup,
  EsriLayerId,
}

export const appTitle: string = "GMS Config Manager";
export const guiVersion: string = "1.0.0.0";

export const tokenStorageName: string = "currentToken";
export const loginStorageName: string = "currentLogin";
export const userStorageName: string = "currentUser";

/**
 * Method used to determine of a login has expired.
 *
 * @param {String} expiry The expiry date to check against.
 * @returns {Boolean} True if the login token has expired; otherwise false.
 */
export const hasLoginExpired = (expiry: string): boolean => {
  const expiryDate = new Date(expiry);
  const now = new Date();

  return now.getTime() > expiryDate.getTime();
};

/**
 * Method to see if the text conforms to ISO 8859-14.
 *
 * @param {string} text The string to check that it conforms to ISO 8859-14.
 * @returns {boolean} True if the text conforms to ISO 8859-14; otherwise false.
 */
export const isIso885914 = (text: string): boolean => {
  let result = true;
  if (text) {
    try {
      const encodedData = encode(text, { mode: "fatal" });
      result = !!encodedData;
    } catch (error) {
      result = false;
    }
  }
  return result;
};

/**
 * Method used to validate a string against a character set.
 * ________________________________
 * GeoPlaceProperty1 - Organisation
 *
 * The valid characters allowed are:
 *
 * • Upper and lower case: A-Z
 *
 * • Numbers: 0-9
 *
 * • Space character
 *
 * • Upper and lower case: ÀÁÂÄÈÉÊËÌÍÎÏÒÓÔÖÚÙÛÜŴÝŸŶ
 *
 * • Punctuation and special characters: . , & ; : [ ] ( ) + - / _ @ £ $
 *
 *
 * ____________________________________
 * GeoPlaceProperty2 - PAO and SAO Text
 *
 * The valid characters allowed are:
 *
 * • Upper and lower case: A-Z
 *
 * • Numbers: 0-9
 *
 * • Space character
 *
 * • Upper and lower case: ÀÁÂÄÈÉÊËÌÍÎÏÒÓÔÖÚÙÛÜŴÝŸŶ
 *
 * • Punctuation and special characters: ! . , & ; : [ ] ( ) + - / _ @ £ $
 *
 *
 * ___________________________________
 * GeoPlaceAZOnly - PAO and SAO suffix
 *
 * • A-Z
 *
 * _________________________________________________________________________________________________________________________________
 * GeoPlaceStreet1 - Type 1, 2, 4 and 9 street descriptor, town and locality as well as OneScotland text fields not specified below.
 *
 * Valid characters are A-Z, a-z, 0-9 or any of ! # $ % “ & ' ( ) * - + , . / : ; < = > ? [ \ ] ^ _ | ~ @ { } £ © § ® ¶ Ŵ ŵ Ṫ ṫ Ŷ ŷ Ḃ ḃ Ċ ċ Ḋ ḋ Ẁ Ẃ Ỳ Ÿ Ḟ ḟ Ġ ġ Ṁ ṁ Ṗ ẁ ṗ ẃ Ṡ ṡ ỳ Ẅ ẅ À Á Â Ã Ä Å Æ Ç È É Ê Ë Ì Í Î Ï Ñ Ò Ó Ô Õ Ö Ø Ù Ú Û Ü Ý ß à á â ã ä å æ ç è é ê ë ì í î ï ñ ò ó ô õ ö ø ù ú û ü ý ÿ and the space character.
 *
 * _______________________________
 * GeoPlaceStreet2 - Type 3 street
 *
 * Valid characters are A-Z, a-z, 0-9, ( ) and the space character.
 *
 * ___________________
 * OneScotlandProperty
 *
 * Valid characters are A-Z, a-z, 0-9, ' - / \ & , and the space character.
 *
 * _________________
 * OneScotlandStreet
 *
 * Valid characters are A-Z, a-z, 0-9, ' - . and the space character.
 *
 * _________________
 * OneScotlandLookup
 *
 * Valid characters are A-Z, a-z, 0-9, ' - and the space character.
 *
 * @returns {Boolean} True if the string is valid; otherwise false.
 */
export const characterSetValidator = (str: string, characterSet: CharacterSet): boolean => {
  let valid = true;

  switch (characterSet) {
    case CharacterSet.GeoPlaceProperty1:
    case CharacterSet.GeoPlaceProperty2:
    case CharacterSet.OneScotlandProperty:
    case CharacterSet.GeoPlaceStreet1:
      valid = isIso885914(str);
      break;

    case CharacterSet.GeoPlaceAZOnly:
      valid = !/[^A-Z]+/giu.test(str);
      break;

    case CharacterSet.GeoPlaceStreet2:
      valid = !/[^a-zA-Z0-9 ()]+/giu.test(str);
      break;

    case CharacterSet.EsriLayerId:
      valid = !/[^a-zA-Z0-9]+/giu.test(str);
      break;

    case CharacterSet.OneScotlandStreet:
      valid = !/[^a-zA-Z0-9 \-'.]+/giu.test(str);
      break;

    case CharacterSet.OneScotlandLookup:
      valid = !/[^a-zA-Z0-9 \-']+/giu.test(str);
      break;

    default:
      valid = true;
      break;
  }

  return valid;
};

/**
 * A method to determine the type of browser this app is running under.
 *
 * @param {string} agent The window.navigator userAgent.
 * @returns {string} A string representing the browser that the user is using.
 */
export const browser = (agent: string): string => {
  switch (true) {
    case agent.indexOf("edge") > -1:
      return "MS Edge (EdgeHtml)";
    case agent.indexOf("edg") > -1:
      return "MS Edge Chromium";
    case agent.indexOf("opr") > -1:
      return "opera";
    case agent.indexOf("chrome") > -1:
      return "chrome";
    case agent.indexOf("trident") > -1:
      return "Internet Explorer";
    case agent.indexOf("firefox") > -1:
      return "firefox";
    case agent.indexOf("safari") > -1:
      return "safari";
    default:
      return "other";
  }
};

export const isEdgeChromium = browser(window.navigator.userAgent.toLowerCase()) === "ms edge chromium";
export const isChrome = browser(window.navigator.userAgent.toLowerCase()) === "chrome";

/**
 * Get the username for the current logged in user.
 *
 * @param {string} username The string from which we need to extract the username.
 * @return {string} The user name.
 */
export function GetUserName(username: string): string {
  if (username) {
    let lastSlash = username.lastIndexOf("/");
    if (lastSlash === -1) lastSlash = username.lastIndexOf("\\");
    let user;
    if (lastSlash > -1) {
      user = username.substring(lastSlash + 1);
    } else user = username;

    return user.replace(".", " ").replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  } else {
    return "Unknown user";
  }
}

/**
 * Convert the given string to a given colour, used for user avatars.
 *
 * @param {string} string The string from which we need to generate a colour string for.
 * @return {string} The colour representation for the given string.
 */
export function StringToColour(string: string): string {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let colour = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return colour;
}

/**
 * Format the supplied date as a string
 *
 * @param {date} params The date to format.
 * @return {string} The formatted date.
 */
export function FormatDate(params: Date | string | undefined): string {
  if (params) {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    let paramsDate = new Date(params);
    const luDay = paramsDate.getDate();
    const luMonth = paramsDate.getMonth();
    const luYear = paramsDate.getFullYear();

    // if param dates is today show AM/PM time
    if (luDay === todayDay && luMonth === todayMonth && luYear === todayYear) return formatAMPM(paramsDate);

    //if param date is in the same month and year, but not today
    if (luMonth === todayMonth && luYear === todayYear)
      return `${getDayString(paramsDate.getDay())} ${luDay} ${getMonthString(luMonth)}`;

    //if param date is same year but not same month
    if (luYear === todayYear) return `${luDay} ${getMonthString(luMonth)}`;

    return `${luDay} ${getMonthString(luMonth)} ${String(luYear)}`;
  } else {
    return "";
  }
}

/**
 * Format the time element using AM/PM
 *
 * @param {date} date The date object that the formatted time is required from.
 * @return {string} The formatted time.
 */
function formatAMPM(date: Date): string {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
  let strTime = hours + ":" + strMinutes + " " + ampm;
  return strTime;
}

/**
 * Return the string of the day for the date supplied
 *
 * @param {number} day The number of the day (0: Sun - 6: Sat)
 * @return {string} The day string.
 */
function getDayString(day: number): string {
  switch (day) {
    case 0:
      return "Sun";
    case 1:
      return "Mon";
    case 2:
      return "Tue";
    case 3:
      return "Wed";
    case 4:
      return "Thu";
    case 5:
      return "Fri";
    default:
      return "Sat";
  }
}

/**
 * Return the string of the month for the date supplied.
 *
 * @param {number} month The number for the month (0: Jan - 11: Dec)
 * @return {string} The month string
 */
export function getMonthString(month: number): string {
  switch (month) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    default:
      return "Dec";
  }
}

/**
 * Return the  lookup values in title case if required.
 *
 * @param {string} option The lookup option that needs to be converted to title case.
 * @param {boolean} doNotSetTitleCase If true then the option is not converted.
 * @return {string} The lookup in title case, if required.
 */
export function lookupToTitleCase(option: string, doNotSetTitleCase: boolean): string {
  if (doNotSetTitleCase || !option || option.length === 0) return option ? option : "";
  else if (option.includes(",") && !option.includes(", "))
    return option
      .replace(",", ", ")
      .replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
      })
      .replace("Nlpg", "NLPG")
      .replace("Bs7666", "BS7666")
      .replace("Crm", "CRM")
      .replace("Sn And N", "SN and N")
      .replace("Lpi", "LPI")
      .replace("Symphony Snn", "Symphony SNN")
      .replace("Symphony Iexchange", "Symphony iExchange")
      .replace("Lo_asd", "LO_ASD")
      .replaceAll(" And ", " and ")
      .replaceAll(" The ", " the ")
      .replaceAll(" Of ", " of ")
      .replaceAll(" To ", " to ");
  else
    return option
      .replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
      })
      .replace("Nlpg", "NLPG")
      .replace("Bs7666", "BS7666")
      .replace("Crm", "CRM")
      .replace("Sn And N", "SN and N")
      .replace("Lpi", "LPI")
      .replace("Symphony Snn", "Symphony SNN")
      .replace("Symphony Iexchange", "Symphony iExchange")
      .replace("Lo_asd", "LO_ASD")
      .replaceAll(" And ", " and ")
      .replaceAll(" The ", " the ")
      .replaceAll(" Of ", " of ")
      .replaceAll(" To ", " to ");
}

/**
 * Determine if 2 arrays are the same
 *
 * @param {array} a The first array.
 * @param {array} b The second array.
 * @return {boolean} True if the arrays are the same; otherwise false.
 */
export function ArraysEqual(a: object[], b: object[]): boolean {
  a = Array.isArray(a) ? a : [];
  b = Array.isArray(b) ? b : [];
  return (
    a.length === b.length &&
    a.every((el, ix) => {
      if (
        typeof el === "object" &&
        !Array.isArray(el) &&
        el !== null &&
        typeof b[ix] === "object" &&
        !Array.isArray(b[ix]) &&
        b[ix] !== null
      ) {
        return ObjectComparison(el, b[ix], []);
      } else return el === b[ix];
    })
  );
}

export function isValidHttpUrl(urlString: string): boolean {
  let url;

  try {
    url = new URL(urlString);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
