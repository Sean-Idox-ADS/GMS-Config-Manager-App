//#region header */
/**************************************************************************************************
//
//  Description: The new configuration document model
//
//  Copyright:    © 2025 Idox Software Limited
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
//#region Version 1.0.0.0 changes
//    001   04.03.25 Sean Flook          GMSCM-1 Initial Revision.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

import ConfigOrganisation from "./configOrganisationType";

export default interface NewConfigType {
  name: string;
  organisations: ConfigOrganisation[];
}
