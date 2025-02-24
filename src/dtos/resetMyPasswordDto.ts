//#region header */
/**************************************************************************************************
//
//  Description: ResetMyPassword DTO
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

export default interface ResetMyPasswordDto {
  resetId: string;
  code: string;
  password: string;
  confirmPassword: string;
}
