//#region header */
/**************************************************************************************************
//
//  Description: The configuration organisation model
//
//  Copyright:    © 2025 Idox Software Limited
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
//#region Version 1.0.0.0 changes
//    001   25.02.25 Sean Flook          GMSCM-1 Initial Revision.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

export default interface ConfigOrganisation {
  organisationName: string;
  symphonyConnectionString: string;
  server: string;
  database: string;
  userId: string;
  password: string;
  elasticAlias: string;
  elasticNodes: string[];
}
