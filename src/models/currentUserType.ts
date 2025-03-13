//#region header */
/**************************************************************************************************
//
//  Description: Current user type
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
//    002   12.03.25 Sean Flook          GMSCM-1 Added isAdministrator and isSuperAdministrator.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

export interface ExtraInformation {
  key: string;
  value: string;
}

export default interface CurrentUserType {
  token: string;
  firstName: string;
  lastName: string;
  auditName: string;
  email: string;
  organisation: string;
  active: boolean;
  rights: string[];
  extraInformation: ExtraInformation[];
  isDeleted: boolean;
  created: string;
  lastUpdated: string;
  displayName: string;
  isAdministrator: boolean;
  isSuperAdministrator: boolean;
}
