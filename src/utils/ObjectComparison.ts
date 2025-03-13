// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Method to compare two objects
//
//  Copyright:    © 2025 Idox Software Limited.
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
// region Version 1.0.0.0
//    001   12.03.25 Sean Flook          GMSCM-1 Initial Revision.
// endregion Version 1.0.0.0
//
//--------------------------------------------------------------------------------------------------
// endregion header

import { ArraysEqual } from "./HelperUtils";

export const configDocumentKeysToIgnore: string[] = [
  "created",
  "lastUpdated",
  "createdBy",
  "lastUpdatedBy",
  "organisations",
];

export const configOrganisationKeysToIgnore: string[] = ["elasticNodes"];

/**
 * Method to compare two objects to see if they are the same.
 *
 * @param object1 The first object to compare.
 * @param object2 The second object to compare.
 * @param keysToIgnore List of keys to ignore in the objects
 * @returns True if the objects are the same, otherwise false.
 */
export default function ObjectComparison(
  object1: object | undefined,
  object2: object | undefined,
  keysToIgnore?: string[]
): boolean {
  if (!object1 || !object2) {
    return false;
  }

  const keys_object1: string[] = Object.keys(object1);
  const keys_object2: string[] = Object.keys(object2);

  const keys1: string[] =
    keys_object1 && keysToIgnore ? keys_object1.filter((x) => !keysToIgnore.includes(x)) : keys_object1;
  const keys2: string[] =
    keys_object2 && keysToIgnore ? keys_object2.filter((x) => !keysToIgnore.includes(x)) : keys_object2;

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    const object1Value: any = (object1 as { [key: string]: any })[key];
    const object2Value: any = (object2 as { [key: string]: any })[key];

    if (Array.isArray(object1Value) && Array.isArray(object2Value)) {
      if (!ArraysEqual(object1Value, object2Value)) {
        return false;
      }
    } else if (object1Value !== object2Value) {
      return false;
    }
  }

  return true;
}
