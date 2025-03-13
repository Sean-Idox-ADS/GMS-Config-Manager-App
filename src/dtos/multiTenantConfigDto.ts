// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Multi Tenant Configuration DTO
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

export interface MultiTenantConfigOrganisation {
  organisationName: string;
  symphonyConnectionString: string;
  elasticAlias: string;
  elasticNodes: string[];
}

export default interface MultiTenantConfigGetDto {
  id: string;
  configType: string;
  version: number;
  name: string;
  created: string;
  lastUpdated: string;
  createdBy: string;
  lastUpdatedBy: string;
  organisations: MultiTenantConfigOrganisation[];
}

export interface MultiTenantConfigPostDto {
  name: string;
  organisations: MultiTenantConfigOrganisation[];
}

export interface MultiTenantConfigPutDto {
  id: string;
  name: string;
  organisations: MultiTenantConfigOrganisation[];
}
