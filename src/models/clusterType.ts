// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Cluster Type
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

import Api from "./apiType";

export default interface ClusterType {
  name: string;
  apis: Api[];
  organisations: string[];
}
