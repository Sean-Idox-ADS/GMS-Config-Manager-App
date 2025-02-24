//#region header */
/**************************************************************************************************
//
//  Description: WhoAmI DTO
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

import { ExtraInformation } from "../models/currentUserType";

export default interface WhoAmIDto {
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
}
