// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Cluster Page
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

import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import UserContext from "../context/UserContext";
import ClusterContext from "../context/ClusterContext";

import MultiTenantClusterGetDto, {
  MultiTenantClusterPostDto,
  MultiTenantClusterPutDto,
  UserApis,
} from "../dtos/multiTenantClusterDto";

import {
  GetMultiTenantCluster,
  PostMultiTenantCluster,
  PutMultiTenantCluster,
} from "../configuration/ADSConfiguration";

import { Backdrop, Box, Button, CircularProgress, Grid2, Stack } from "@mui/material";

import ClusterTree from "../forms/ClusterTree";
import ClusterForm from "../forms/ClusterForm";
import ClusterOrganisationForm from "../forms/ClusterOrganisationForm";
import ClusterApiForm from "../forms/ClusterApiForm";

import SaveIcon from "@mui/icons-material/Save";
import ErrorIcon from "@mui/icons-material/Error";

import { dataFormStyle, getSaveButtonStyle, toolbarStyle } from "../utils/ADSStyles";
import { ArraysEqual } from "../utils/HelperUtils";
import AddDialog, { AddVariant } from "../dialogs/AddDialog";
import ConfirmEditLossDialog from "../dialogs/ConfirmEditLossDialog";
import ClusterErrorType from "../models/clusterErrorType";
import { validateCluster } from "../utils/ClusterValidation";

interface ClusterPageProps {}

const ClusterPage: React.FC<ClusterPageProps> = () => {
  const userContext = useContext(UserContext);
  const clusterContext = useContext(ClusterContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [clusterError, setClusterError] = useState<ClusterErrorType[] | undefined>(undefined);
  const [clusterData, setClusterData] = useState<MultiTenantClusterGetDto[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>("");
  const [clusterFormData, setClusterFormData] = useState<MultiTenantClusterGetDto | undefined>();
  const [apiFormData, setApiFormData] = useState<UserApis | undefined>();
  const [organisationFormData, setOrganisationFormData] = useState<string[] | undefined>();

  const [enableSave, setEnableSave] = useState<boolean>(false);
  const [haveErrors, setHaveErrors] = useState<boolean>(false);
  const [errorIds, setErrorIds] = useState<string[]>([]);

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openConformation, setOpenConformation] = useState<boolean>(false);

  const originalClusterData = useRef<MultiTenantClusterGetDto[]>([]);
  const addId = useRef<string | undefined>(undefined);

  const modifiedItems = useRef<string[]>([]);
  const newSelectedItemId = useRef<string | undefined>(undefined);

  /**
   * Event to handle when a node from the tree view is selected.
   *
   * @param nodeId The id of the selected node.
   */
  const handleItemSelectedEvent = useCallback(
    (nodeId: string | undefined): void => {
      const nodeIds: string[] = nodeId ? nodeId.split("|") : [];
      const changedDocument: boolean = !selectedItemId || selectedItemId.split("|")[0] !== nodeIds[0];
      newSelectedItemId.current = nodeId;

      if (changedDocument && selectedItemId && modifiedItems.current.includes(selectedItemId.split("|")[0])) {
        // Show a warning message that there are unsaved changes  and ask the user if they want to continue
        // If they say no, then return and do not change the selected item
        // If they say yes, then continue with the change
        setOpenConformation(true);
      } else {
        if (nodeId) {
          if (nodeIds && nodeIds.length > 0) {
            let selectedCluster: MultiTenantClusterGetDto | undefined = clusterData.find((x) => x.id === nodeIds[0]);
            let selectedApis: UserApis | undefined = undefined;
            let selectedOrganisations: string[] | undefined = undefined;

            if (changedDocument) {
              const clonedCluster = structuredClone(selectedCluster);
              if (clonedCluster) clusterContext.onSetOriginalCluster(clonedCluster);
            }

            setSelectedItemId(nodeId);
            clusterContext.onUpdateCurrentClusterItem(nodeId);

            if (selectedCluster && nodeIds.length > 1) {
              if (nodeIds[1] === "organisations") selectedOrganisations = selectedCluster.organisations;
              if (nodeIds[1] === "user-apis") selectedApis = selectedCluster.userApis;
            }

            setClusterFormData(undefined);
            setApiFormData(undefined);
            setOrganisationFormData(undefined);

            if (selectedOrganisations) {
              setOrganisationFormData(selectedOrganisations);
            } else if (selectedApis) {
              setApiFormData(selectedApis);
            } else if (selectedCluster) {
              setClusterFormData(selectedCluster);
            }
          }
        } else {
          setSelectedItemId(undefined);
          clusterContext.onUpdateCurrentClusterItem(undefined);
          newSelectedItemId.current = undefined;
          setClusterFormData(undefined);
          setApiFormData(undefined);
          setOrganisationFormData(undefined);
        }
      }
    },
    [clusterData, selectedItemId, clusterContext]
  );

  const handleAddItem = (type: string, id?: string | undefined): void => {
    switch (type) {
      case "cluster":
        handleAddCluster();
        break;

      case "organisation":
        if (id) {
          handleAddOrganisation(id);
        }
        break;

      default:
        break;
    }
  };

  /**
   * Method to maintain the list of modified items.
   *
   * @param {string} docId The id of the document.
   * @param {boolean} hasChanged A flag indicating if the document has changed.
   */
  const updateModifiedItems = (docId: string, hasChanged: boolean): void => {
    const newList: string[] = [...modifiedItems.current];
    const index: number = newList.indexOf(docId);
    if (index === -1 && hasChanged) {
      newList.push(docId);
    } else if (!hasChanged && index !== -1) {
      newList.splice(index, 1);
    }
    modifiedItems.current = newList;
    clusterContext.onClusterChanged(modifiedItems.current.length > 0);
    setEnableSave(newList.length > 0);
  };

  /**
   * Method to display the cluster form.
   *
   * @param {MultiTenantClusterGetDto} cluster The cluster to display.
   */
  const displayClusterForm = (cluster: MultiTenantClusterGetDto): void => {
    setClusterFormData(cluster);
    setApiFormData(undefined);
    setOrganisationFormData(undefined);
  };

  /**
   * Method to add a new cluster record.
   */
  const handleAddCluster = (): void => {
    clusterContext.onNewClusterAdded(true);

    const newCluster: MultiTenantClusterGetDto = {
      id: "new",
      configType: "MTClusterConfig",
      version: 1,
      name: "_New Cluster",
      application: "",
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      createdBy: userContext.currentUser?.displayName ?? "",
      lastUpdatedBy: userContext.currentUser?.displayName ?? "",
      userApis: {
        iManage: "",
        Settings: "",
        Lookups: "",
      },
      organisations: [],
    };

    const updatedClusters = [...clusterData];
    updatedClusters.push(newCluster);
    updateClusters(updatedClusters);

    newSelectedItemId.current = newCluster.id;
    clusterContext.onSetOriginalCluster(newCluster!);
    setSelectedItemId(newCluster.id);
    clusterContext.onUpdateCurrentClusterItem(newCluster.id);
    displayClusterForm(newCluster);
    updateModifiedItems(newCluster.id, true);
    clusterContext.onClusterChanged(true);
    setEnableSave(true);
    document.getElementById(newCluster.id!)?.scrollIntoView();
    document.getElementById(newCluster.id!)?.focus();
  };

  /**
   * Method to handle the event when a new organisation is added.
   *
   * @param {string} id The id of the currently selected node.
   */
  const handleAddOrganisation = (id: string): void => {
    if (id) {
      addId.current = id;
      setOpenAddDialog(true);
    }
  };

  /**
   * Method to save the cluster record.
   *
   * @param {string} nodeId The id of the node to save.
   * @return {Promise<void>}
   */
  const handleSaveClicked = async (nodeId: string): Promise<void> => {
    if (nodeId) {
      const nodeIds: string[] = nodeId.split("|");
      const currentCluster: MultiTenantClusterGetDto | undefined = clusterData.find((x) => x.id === nodeIds[0]);

      setClusterError(undefined);

      const validationErrors: ClusterErrorType[] | undefined = validateCluster(clusterData, currentCluster);

      if (!validationErrors || validationErrors.length === 0) {
        let result: MultiTenantClusterGetDto | undefined = undefined;

        if (currentCluster) {
          if (clusterContext.newCluster) {
            const newClusterData: MultiTenantClusterPostDto = {
              name: currentCluster.name,
              application: currentCluster.application,
              userApis: currentCluster.userApis,
              organisations: currentCluster.organisations,
            };

            result = await PostMultiTenantCluster(userContext.currentToken, newClusterData, "new", setClusterError);

            if (!!result) {
              clusterContext.onNewClusterAdded(false);
            }
          } else {
            const updatedClusterData: MultiTenantClusterPutDto = {
              id: currentCluster.id,
              name: currentCluster.name,
              application: currentCluster.application,
              userApis: currentCluster.userApis,
              organisations: currentCluster.organisations,
            };

            setClusterError(undefined);

            result = await PutMultiTenantCluster(
              userContext.currentToken,
              updatedClusterData,
              currentCluster.id,
              setClusterError
            );
          }

          if (!!result) {
            modifiedItems.current = [];
            let updatedClusters: MultiTenantClusterGetDto[] = [...clusterData];
            const index: number = updatedClusters.findIndex((x) => x.id === selectedItemId);
            updatedClusters[index] = result;
            updateClusters(updatedClusters);
            originalClusterData.current = updatedClusters;
            setEnableSave(false);
            clusterContext.onClusterChanged(false);

            handleItemSelectedEvent(result.id);
            displayClusterForm(result);
            document.getElementById(result.id!)?.scrollIntoView();
            document.getElementById(result.id!)?.focus();
          }
        }
      } else {
        setClusterError(validationErrors);
      }
    }
  };

  /**
   * Method to handle the change of the cluster data.
   *
   * @param data The new cluster data.
   */
  const handleClusterDataChange = (data: MultiTenantClusterGetDto): void => {
    setClusterFormData(data);
    const updatedCluster = clusterData
      .map((x) => (x.id === data.id ? data : x))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
    setClusterData(updatedCluster);
    const clusterChanged = !ArraysEqual(
      originalClusterData.current.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
      ),
      updatedCluster
    );
    updateModifiedItems(data.id, clusterChanged);
    setEnableSave(clusterChanged);
  };

  /**
   * Method to handle the change of the api data.
   *
   * @param {UserApis} data The new api data.
   */
  const handleApiDataChange = (data: UserApis): void => {
    if (selectedItemId) {
      const currentCluster: MultiTenantClusterGetDto | undefined = clusterData.find(
        (x) => x.id === selectedItemId.split("|")[0]
      );

      if (currentCluster) {
        const newCluster: MultiTenantClusterGetDto = {
          id: currentCluster.id,
          configType: currentCluster.configType,
          version: currentCluster.version,
          name: currentCluster.name,
          application: currentCluster.application,
          created: currentCluster.created,
          lastUpdated: currentCluster.lastUpdated,
          createdBy: currentCluster.createdBy,
          lastUpdatedBy: currentCluster.lastUpdatedBy,
          userApis: data,
          organisations: currentCluster.organisations,
        };

        const updatedCluster = clusterData.map((x) => [newCluster].find((rec) => rec.name === x.name) || x);

        setClusterData(updatedCluster);
        const validationErrors: ClusterErrorType[] | undefined = validateCluster(updatedCluster, newCluster);
        setClusterError(validationErrors);
        const clusterChanged = !ArraysEqual(
          originalClusterData.current.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
          ),
          updatedCluster
        );
        setApiFormData(data);
        updateModifiedItems(newCluster.id, clusterChanged);
        clusterContext.onClusterChanged(clusterChanged);
        setEnableSave(clusterChanged);
      }
    }
  };

  /**
   * Method to delete the organisation record.
   *
   * @param name The id for the organisation record that should be deleted.
   */
  const handleDeleteOrganisationRecord = (name: string): void => {
    if (selectedItemId && name) {
      const currentCluster: MultiTenantClusterGetDto | undefined = clusterData.find(
        (x) => x.id === selectedItemId.split("|")[0]
      );

      if (currentCluster) {
        const newCluster: MultiTenantClusterGetDto = {
          id: currentCluster.id,
          configType: currentCluster.configType,
          version: currentCluster.version,
          name: currentCluster.name,
          application: currentCluster.application,
          created: currentCluster.created,
          lastUpdated: currentCluster.lastUpdated,
          createdBy: currentCluster.createdBy,
          lastUpdatedBy: currentCluster.lastUpdatedBy,
          userApis: currentCluster.userApis,
          organisations: currentCluster.organisations.filter((x) => x !== name),
        };

        const updatedCluster = clusterData.map((x) => [newCluster].find((rec) => rec.name === x.name) || x);

        setClusterData(updatedCluster);
        const clusterChanged = !ArraysEqual(
          originalClusterData.current.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
          ),
          updatedCluster
        );
        setOrganisationFormData(newCluster.organisations);
        updateModifiedItems(newCluster.id, clusterChanged);
        clusterContext.onClusterChanged(clusterChanged);
        setEnableSave(clusterChanged);
      }
    }
  };

  /**
   * Method to handle the event when the add dialog is closed.
   */
  const handleAddClose = (): void => {
    setOpenAddDialog(false);
  };

  /**
   * Method to handle the event when the add dialog is done.
   *
   * @param {string} org The name of the organisation to add.
   */
  const handleAddDone = (org: string): void => {
    const currentCluster = clusterData.find((x) => x.id === addId.current);
    if (currentCluster) {
      if (org && !currentCluster.organisations.includes(org)) {
        const newCluster: MultiTenantClusterGetDto = {
          id: currentCluster.id,
          configType: currentCluster.configType,
          version: currentCluster.version,
          name: currentCluster.name,
          application: currentCluster.application,
          created: currentCluster.created,
          lastUpdated: currentCluster.lastUpdated,
          createdBy: currentCluster.createdBy,
          lastUpdatedBy: currentCluster.lastUpdatedBy,
          userApis: currentCluster.userApis,
          organisations: [...currentCluster.organisations, org],
        };

        const updatedCluster = clusterData.map((x) => [newCluster].find((rec) => rec.name === x.name) || x);

        setClusterData(updatedCluster);
        setOrganisationFormData(newCluster.organisations);
        updateModifiedItems(currentCluster.id, true);
        clusterContext.onClusterChanged(true);
        const newClusterError = clusterError?.filter((x) => x.field !== "organisation");
        setClusterError(newClusterError);
        setEnableSave(true);
      }
      setOpenAddDialog(false);
    }
  };

  /**
   * Method to handle the event when the user chooses to save the changes made to the current document.
   */
  const handleSaveChanges = (): void => {
    setOpenConformation(false);
    handleSaveClicked(newSelectedItemId.current!);
  };

  /**
   * Method to update the cluster data.
   *
   * @param {MultiTenantClusterGetDto[]} clusters The new cluster data.
   */
  const updateClusters = useCallback(
    (clusters: MultiTenantClusterGetDto[]): void => {
      setClusterData(clusters);
      originalClusterData.current = clusters;
      clusterContext.onSetClusters(clusters);
    },
    [clusterContext]
  );

  /**
   * Method to handle the event when the user chooses to dispose of any changes made to the current document.
   */
  const handleAllowDispose = useCallback((): void => {
    setOpenConformation(false);
    let updatedClusters: MultiTenantClusterGetDto[] = [...clusterData];
    if (selectedItemId?.split("|")[0] === "new") {
      updatedClusters = clusterData.filter((x) => x.id !== "new");
    } else {
      const currentCluster: MultiTenantClusterGetDto | undefined = clusterData.find(
        (x) => x.id === selectedItemId?.split("|")[0]
      );
      if (currentCluster && clusterContext.originalCluster) {
        const index: number = updatedClusters.findIndex((x) => x.id === selectedItemId?.split("|")[0]);
        updatedClusters[index] = clusterContext.originalCluster;

        if (!!clusterFormData) {
          setClusterFormData(clusterContext.originalCluster);
        } else if (!!apiFormData) {
          setApiFormData(clusterContext.originalCluster.userApis);
        } else if (!!organisationFormData) {
          setOrganisationFormData(clusterContext.originalCluster.organisations);
        }
      }
    }

    updateClusters(updatedClusters);
    originalClusterData.current = updatedClusters;
    modifiedItems.current = [];
    setEnableSave(false);
    setClusterError(undefined);
    handleItemSelectedEvent(newSelectedItemId.current);
    document.getElementById(newSelectedItemId.current!)?.scrollIntoView();
    clusterContext.onClusterChanged(false);
  }, [
    clusterContext,
    clusterData,
    selectedItemId,
    updateClusters,
    handleItemSelectedEvent,
    clusterFormData,
    apiFormData,
    organisationFormData,
  ]);

  /**
   * Method to handle the event when the user cancels moving away from the dialog.
   */
  const handleCancelMoveAway = (): void => {
    setOpenConformation(false);
    document.getElementById(selectedItemId!)?.scrollIntoView();
    document.getElementById(selectedItemId!)?.focus();
    clusterContext.onClearFilter(true);
  };

  useEffect(() => {
    const GetAllData = async () => {
      if (isLoading) {
        setErrorText("");
        setClusterError(undefined);

        const rawClusterData: MultiTenantClusterGetDto[] | undefined = await GetMultiTenantCluster(
          userContext.currentToken,
          setErrorText
        );

        if (rawClusterData) {
          setClusterData(rawClusterData);
          originalClusterData.current = rawClusterData;
          setEnableSave(false);
        } else {
          originalClusterData.current = [];
        }
      }
    };

    if (isLoading && !errorText) {
      GetAllData();
    } else if (errorText) {
      userContext.logoff();
    }
  }, [isLoading, errorText, userContext]);

  useEffect(() => {
    if (!errorText) setIsLoading(!clusterData);
  }, [errorText, clusterData]);

  useEffect(() => {
    setHaveErrors(!!errorText || (clusterError?.length ?? 0) > 0);

    if (clusterError && clusterError.length > 0 && Array.isArray(clusterError)) {
      const ids: string[] = clusterError.map((x) => x.id);
      setErrorIds(ids);
    }
  }, [errorText, clusterError]);

  useEffect(() => {
    if (clusterContext.disableSave) {
      setEnableSave(false);
      clusterContext.onSetDisableSave(false);
    }

    if (clusterContext.revertChanges) {
      handleAllowDispose();
      clusterContext.onSetRevertChanges(false);
    }
  }, [clusterContext, handleAllowDispose]);

  useEffect(() => {
    setClusterError(clusterContext.validationErrors);
  }, [clusterContext.validationErrors]);

  return isLoading ? (
    <div>
      <Backdrop open={isLoading}>
        Loading data, please wait...
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  ) : (
    <>
      <Box sx={dataFormStyle("ADSClusterPageControl")}>
        <Grid2 container justifyContent="flex-start" spacing={0}>
          <Grid2 size={3}>
            <ClusterTree
              data={clusterData}
              selectedItem={selectedItemId}
              haveErrors={haveErrors}
              errorIds={errorIds}
              onItemSelected={handleItemSelectedEvent}
              onAddItem={handleAddItem}
            />
          </Grid2>
          <Grid2 size={9}>
            <Box sx={toolbarStyle}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={1}
                sx={{ ml: "12px", mt: "6px" }}
              >
                <Button
                  id="property-save-button"
                  sx={getSaveButtonStyle(haveErrors)}
                  variant="text"
                  startIcon={!haveErrors ? <SaveIcon /> : <ErrorIcon />}
                  disabled={!enableSave}
                  onClick={() => handleSaveClicked(selectedItemId!)}
                >
                  Save
                </Button>
              </Stack>
            </Box>
            {clusterFormData && (
              <ClusterForm data={clusterFormData} errors={clusterError} onDataChange={handleClusterDataChange} />
            )}
            {apiFormData && (
              <ClusterApiForm data={apiFormData} errors={clusterError} onDataChange={handleApiDataChange} />
            )}
            {organisationFormData && (
              <ClusterOrganisationForm
                data={organisationFormData}
                errors={clusterError}
                onDeleteOrganisationRecord={handleDeleteOrganisationRecord}
              />
            )}
          </Grid2>
        </Grid2>
      </Box>
      <AddDialog
        open={openAddDialog}
        variant={AddVariant.clusterOrganisation}
        onClose={handleAddClose}
        onDone={handleAddDone}
      />
      <ConfirmEditLossDialog
        isOpen={openConformation}
        title="Unsaved changes"
        message="You have made changes to this record, do you want to keep them or discard them?"
        saveText="Keep"
        handleSaveClick={handleSaveChanges}
        handleDisposeClick={handleAllowDispose}
        handleReturnClick={handleCancelMoveAway}
      />
    </>
  );
};

export default ClusterPage;
