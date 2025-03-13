// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Configuration Error types
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

export interface ConfigOrganisationErrorType {
  id: string;
  field: string;
  error: string;
}

export default interface ConfigErrorType {
  id: string;
  field: string;
  errors: string[];
}
