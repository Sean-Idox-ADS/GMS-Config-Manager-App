//#region header */
/**************************************************************************************************
//
//  Description: The configuration document model
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

import ConfigOrganisation from "./configOrganisationType";

export default interface ConfigDocument {
  id: string;
  configType: string;
  version: number;
  name: string;
  created: string;
  lastUpdated: string;
  createdBy: string;
  lastUpdatedBy: string;
  organisations: ConfigOrganisation[];
}
