// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Cluster Context
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

import { createContext, ReactNode, useRef, useState } from "react";
import ClusterContextType from "../models/clusterContextType";
import MultiTenantClusterGetDto from "../dtos/multiTenantClusterDto";
import ClusterErrorType from "../models/clusterErrorType";

/**
 * The cluster context.
 */
const ClusterContext = createContext<ClusterContextType>({} as ClusterContextType);
ClusterContext.displayName = "clusterContext";

/**
 * Component to provide the configuration context.
 */
type ClusterContextProviderProps = {
  children?: ReactNode;
};

/**
 * Component to provide the cluster context.
 *
 * @param children The children of the component.
 */
export const ClusterContextProvider = ({ children }: ClusterContextProviderProps) => {
  const [currentClusterItem, setCurrentClusterItem] = useState<string | undefined>(undefined);
  const [currentOrganisations, setCurrentOrganisations] = useState<string[] | undefined>(undefined);
  const [clusterChanged, setClusterChanged] = useState<boolean>(false);
  const originalCluster = useRef<MultiTenantClusterGetDto | undefined>(undefined);
  const [clearFilter, setClearFilter] = useState<boolean>(false);
  const [clusters, setClusters] = useState<MultiTenantClusterGetDto[]>([]);
  const [newCluster, setNewCluster] = useState<boolean>(false);
  const [disableSave, setDisableSave] = useState<boolean>(false);
  const [revertChanges, setRevertChanges] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ClusterErrorType[] | undefined>(undefined);

  /**
   * Handle setting the original cluster.
   *
   * @param {(MultiTenantClusterGetDto)} cluster The cluster to set.
   */
  function HandleSetOriginalCluster(cluster: MultiTenantClusterGetDto): void {
    originalCluster.current = cluster;
  }

  return (
    <ClusterContext.Provider
      value={{
        currentClusterItem: currentClusterItem,
        currentOrganisations: currentOrganisations,
        clusterChanged: clusterChanged,
        originalCluster: originalCluster.current,
        clearFilter: clearFilter,
        clusters: clusters,
        newCluster: newCluster,
        disableSave: disableSave,
        revertChanges: revertChanges,
        validationErrors: validationErrors,
        onUpdateCurrentClusterItem: setCurrentClusterItem,
        onSetCurrentOrganisations: setCurrentOrganisations,
        onClusterChanged: setClusterChanged,
        onSetOriginalCluster: HandleSetOriginalCluster,
        onClearFilter: setClearFilter,
        onSetClusters: setClusters,
        onNewClusterAdded: setNewCluster,
        onSetDisableSave: setDisableSave,
        onSetRevertChanges: setRevertChanges,
        onSetValidationErrors: setValidationErrors,
      }}
    >
      {children}
    </ClusterContext.Provider>
  );
};

export default ClusterContext;
