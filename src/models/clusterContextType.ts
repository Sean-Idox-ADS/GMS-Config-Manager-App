// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Cluster Context Type
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
import ClusterErrorType from "./clusterErrorType";

export default interface ClusterContextType {
  currentClusterItem: string | undefined;
  currentOrganisations: string[] | undefined;
  clusterChanged: boolean;
  originalCluster: MultiTenantClusterGetDto | undefined;
  clearFilter: boolean;
  clusters: MultiTenantClusterGetDto[];
  newCluster: boolean;
  disableSave: boolean;
  revertChanges: boolean;
  validationErrors: ClusterErrorType[] | undefined;
  onUpdateCurrentClusterItem(newCurrentClusterItem: string | undefined): void;
  onSetCurrentOrganisations(organisations: string[] | undefined): void;
  onClusterChanged(changed: boolean): void;
  onSetOriginalCluster(cluster: MultiTenantClusterGetDto): void;
  onClearFilter(clearFilter: boolean): void;
  onSetClusters(clusters: MultiTenantClusterGetDto[]): void;
  onNewClusterAdded(added: boolean): void;
  onSetDisableSave(disableSave: boolean): void;
  onSetRevertChanges(revertChanges: boolean): void;
  onSetValidationErrors(errors: ClusterErrorType[] | undefined): void;
}
