// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Multi Tenant Cluster DTO
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

export interface UserApis {
  iManage: string;
  Settings: string;
  Lookups: string;
}

export default interface MultiTenantClusterGetDto {
  id: string;
  configType: string;
  version: number;
  name: string;
  application: string;
  created: string;
  lastUpdated: string;
  createdBy: string;
  lastUpdatedBy: string;
  userApis: UserApis;
  organisations: string[];
}

export interface MultiTenantClusterPostDto {
  name: string;
  application: string;
  userApis: UserApis;
  organisations: string[];
}

export interface MultiTenantClusterPutDto {
  name: string;
  application: string;
  userApis: UserApis;
  organisations: string[];
  id: string;
}
