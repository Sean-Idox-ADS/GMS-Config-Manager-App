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
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

import { encode } from "iso-8859-14";

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

export const tokenStorageName = "currentToken";
export const loginStorageName = "currentLogin";
export const userStorageName = "currentUser";

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

export const isEdgeChromium = browser(window.navigator.userAgent.toLowerCase()) === "MS Edge Chromium";
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
