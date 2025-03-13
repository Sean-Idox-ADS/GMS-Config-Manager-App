// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Method to validate the cluster
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

import MultiTenantClusterGetDto from "../dtos/multiTenantClusterDto";
import ClusterErrorType from "../models/clusterErrorType";
import { isValidHttpUrl } from "./HelperUtils";

export const validateCluster = (
  clusterData: MultiTenantClusterGetDto[],
  cluster: MultiTenantClusterGetDto | undefined
): ClusterErrorType[] | undefined => {
  let validationErrors: ClusterErrorType[] = [];

  if (cluster) {
    if (!cluster.name || cluster.name.trim().length === 0) {
      validationErrors.push({
        id: cluster.id,
        field: "name",
        errors: ["The cluster name is required."],
      });
    }

    if (cluster.name && cluster.name === "_New Cluster") {
      validationErrors.push({
        id: cluster.id,
        field: "name",
        errors: ["The cluster name cannot be '_New Cluster'."],
      });
    }

    const existingCluster = clusterData.find((x) => x.id !== cluster.id && x.name === cluster.name);

    if (existingCluster) {
      validationErrors.push({
        id: cluster.id,
        field: "name",
        errors: ["The cluster name must be unique."],
      });
    }

    if (!cluster.application || cluster.application.trim().length === 0) {
      validationErrors.push({
        id: cluster.id,
        field: "application",
        errors: ["The application is required."],
      });
    }

    if (!cluster.userApis.iManage || cluster.userApis.iManage.trim().length === 0) {
      validationErrors.push({
        id: cluster.id,
        field: "imanage",
        errors: ["The iManage API is required."],
      });
    } else if (!cluster.userApis.iManage.startsWith("https://")) {
      validationErrors.push({
        id: cluster.id,
        field: "imanage",
        errors: ["The iManage API must start with 'https://'."],
      });
    } else if (!isValidHttpUrl(cluster.userApis.iManage)) {
      validationErrors.push({
        id: cluster.id,
        field: "imanage",
        errors: ["The iManage API is not a valid URL."],
      });
    }

    if (!cluster.userApis.Settings || cluster.userApis.Settings.trim().length === 0) {
      validationErrors.push({
        id: cluster.id,
        field: "settings",
        errors: ["The Settings API is required."],
      });
    } else if (!cluster.userApis.Settings.startsWith("https://")) {
      validationErrors.push({
        id: cluster.id,
        field: "settings",
        errors: ["The Settings API must start with 'https://'."],
      });
    } else if (!isValidHttpUrl(cluster.userApis.Settings)) {
      validationErrors.push({
        id: cluster.id,
        field: "settings",
        errors: ["The Settings API is not a valid URL."],
      });
    }

    if (!cluster.userApis.Lookups || cluster.userApis.Lookups.trim().length === 0) {
      validationErrors.push({
        id: cluster.id,
        field: "lookups",
        errors: ["The Lookups API is required."],
      });
    } else if (!cluster.userApis.Lookups.startsWith("https://")) {
      validationErrors.push({
        id: cluster.id,
        field: "lookups",
        errors: ["The Lookups API must start with 'https://'."],
      });
    } else if (!isValidHttpUrl(cluster.userApis.Lookups)) {
      validationErrors.push({
        id: cluster.id,
        field: "lookups",
        errors: ["The Lookups API is not a valid URL."],
      });
    }

    if (!cluster.organisations || cluster.organisations.length === 0) {
      validationErrors.push({
        id: cluster.id,
        field: "organisation",
        errors: ["At least one organisation is required."],
      });
    }
  }

  return validationErrors;
};
