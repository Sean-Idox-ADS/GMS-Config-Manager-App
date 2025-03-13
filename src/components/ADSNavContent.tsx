//#region header */
/**************************************************************************************************
//
//  Description: Navigation Bar contents
//
//  Copyright:    © 2025 Idox Software Limited
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
//#region Version 1.0.0.0 changes
//    001   21.02.25 Sean Flook          GMSCM-1 Initial Revision.
//    002   12.03.25 Sean Flook          GMSCM-1 Code required for managing the configuration and cluster documents.
//    003   13.03.25 Sean Flook          GMSCM-1 Added code to handle when a users token has expired.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfigContext from "../context/ConfigContext";
import ClusterContext from "../context/ClusterContext";
import UserContext from "../context/UserContext";

import { ClusterRoute, DocumentsRoute } from "../PageRouting";

import ConfigDocument from "../models/configDocumentType";
import ConfigErrorType from "../models/configErrorType";
import MultiTenantConfigGetDto, {
  MultiTenantConfigPostDto,
  MultiTenantConfigPutDto,
} from "../dtos/multiTenantConfigDto";
import MultiTenantClusterGetDto, {
  MultiTenantClusterPostDto,
  MultiTenantClusterPutDto,
} from "../dtos/multiTenantClusterDto";
import ClusterErrorType from "../models/clusterErrorType";

import { validateConfig } from "../utils/ConfigurationValidation";
import { validateCluster } from "../utils/ClusterValidation";
import {
  PostMultiTenantCluster,
  PostMultiTenantConfig,
  PutMultiTenantCluster,
  PutMultiTenantConfig,
} from "../configuration/ADSConfiguration";

import { Box, Drawer, Grid2, IconButton, Stack, Tooltip } from "@mui/material";
import ADSUserAvatar from "./ADSUserAvatar";

import ConfirmEditLossDialog from "../dialogs/ConfirmEditLossDialog";

import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import GroupsIcon from "@mui/icons-material/Groups";

import { adsBlueA, adsLightGreyA50, adsLightGreyB, adsMidGreyA } from "../utils/ADSColour";
import { dataFormStyle, tooltipStyle } from "../utils/ADSStyles";
import { useTheme } from "@mui/material/styles";

interface ADSNavContentProps {}

const ADSNavContent: React.FC<ADSNavContentProps> = () => {
  const theme = useTheme();
  const navBarWidth: string = "60px";

  const navigate = useNavigate();

  const configContext = useContext(ConfigContext);
  const clusterContext = useContext(ClusterContext);
  const userContext = useContext(UserContext);

  const [documentsActive, setDocumentsActive] = useState<boolean>(true);
  const [clusterGroupsActive, setClusterGroupsActive] = useState<boolean>(false);
  const [openConformation, setOpenConformation] = useState<boolean>(false);

  const [configError, setConfigError] = useState<ConfigErrorType[] | undefined>(undefined);
  const [clusterError, setClusterError] = useState<ClusterErrorType[] | undefined>(undefined);

  const [tokenExpired, setTokenExpired] = useState<boolean>(false);

  const currentType = useRef<string | null>(null);

  /**
   * Method to set the currently active button.
   */
  const setActiveButton = (currentRoute: string): void => {
    setDocumentsActive(currentRoute === DocumentsRoute);
    setClusterGroupsActive(currentRoute === ClusterRoute);
  };

  /**
   * Method used to open the configuration documents page.
   */
  const handleConfigurationDocumentsClick = (): void => {
    if (!clusterContext.clusterChanged) {
      navigate(DocumentsRoute);
      setActiveButton(DocumentsRoute);
    } else {
      currentType.current = "cluster";
      setOpenConformation(true);
    }
  };

  /**
   * Method used to open the cluster groups page.
   */
  const handleClusterGroupsClick = (): void => {
    if (!configContext.documentChanged) {
      navigate(ClusterRoute);
      setActiveButton(ClusterRoute);
    } else {
      currentType.current = "configuration";
      setOpenConformation(true);
    }
  };

  /**
   * Method to handle the event when the user chooses to save the changes made to the current document.
   */
  const handleUserSaveChanges = (type: string): void => {
    currentType.current = type;
    setOpenConformation(true);
  };

  /**
   * Method to handle the event when the user chooses to save the changes made to the current document.
   */
  const handleSaveChanges = async (): Promise<void> => {
    setOpenConformation(false);

    if (["configuration", "user_configuration"].includes(currentType.current || "")) {
      if (configContext.currentConfigItem) {
        const nodeIds: string[] = configContext.currentConfigItem.split("|");
        const currentDocument: ConfigDocument | undefined = configContext.configurationDocuments.find(
          (x) => x.id === nodeIds[0]
        );

        const validationErrors: ConfigErrorType[] | undefined = validateConfig(
          configContext.configurationDocuments,
          currentDocument
        );

        if (!validationErrors || validationErrors.length === 0) {
          configContext.onSetValidationErrors(undefined);
          let result: MultiTenantConfigGetDto | undefined = undefined;

          if (currentDocument) {
            if (configContext.newConfig) {
              const newConfigData: MultiTenantConfigPostDto = {
                name: currentDocument.name,
                organisations: currentDocument.organisations.map((org) => {
                  return {
                    organisationName: org.organisationName,
                    symphonyConnectionString: org.symphonyConnectionString,
                    elasticAlias: org.elasticAlias,
                    elasticNodes: org.elasticNodes,
                  };
                }),
              };

              result = await PostMultiTenantConfig(
                userContext.currentToken,
                newConfigData,
                "new",
                setConfigError,
                setTokenExpired
              );

              if (!!result) {
                configContext.onNewConfigAdded();
              } else {
                if (tokenExpired) {
                  userContext.logoff();
                  setTokenExpired(false);
                }
              }
            } else {
              const updatedConfigData: MultiTenantConfigPutDto = {
                id: currentDocument.id,
                name: currentDocument.name,
                organisations: currentDocument.organisations.map((org) => {
                  return {
                    organisationName: org.organisationName,
                    symphonyConnectionString: org.symphonyConnectionString,
                    elasticAlias: org.elasticAlias,
                    elasticNodes: org.elasticNodes,
                  };
                }),
              };

              setConfigError(undefined);

              result = await PutMultiTenantConfig(
                userContext.currentToken,
                updatedConfigData,
                currentDocument.id,
                setConfigError,
                setTokenExpired
              );
            }

            if (!!result) {
              configContext.onDocumentChanged(false);
              configContext.onSetDisableSave(true);
              if (currentType.current === "configuration") {
                navigate(ClusterRoute);
                setActiveButton(ClusterRoute);
              } else if (currentType.current === "user_configuration") {
                userContext.onDisplayDialog(true);
              }
            } else {
              if (tokenExpired) {
                userContext.logoff();
                setTokenExpired(false);
              } else if (configError) {
                configContext.onSetValidationErrors(configError);
              }
            }
          }
        } else {
          configContext.onSetValidationErrors(validationErrors);
        }
      }
    } else if (["cluster", "user_cluster"].includes(currentType.current || "")) {
      if (clusterContext.currentClusterItem) {
        const nodeIds: string[] = clusterContext.currentClusterItem.split("|");
        const currentCluster: MultiTenantClusterGetDto | undefined = clusterContext.clusters.find(
          (x) => x.id === nodeIds[0]
        );

        const validationErrors: ClusterErrorType[] | undefined = validateCluster(
          clusterContext.clusters,
          currentCluster
        );

        if (!validationErrors || validationErrors.length === 0) {
          clusterContext.onSetValidationErrors(undefined);
          let result: MultiTenantClusterGetDto | undefined = undefined;

          if (currentCluster) {
            if (clusterContext.newCluster) {
              const newClusterData: MultiTenantClusterPostDto = {
                name: currentCluster.name,
                application: currentCluster.application,
                userApis: currentCluster.userApis,
                organisations: currentCluster.organisations,
              };

              result = await PostMultiTenantCluster(
                userContext.currentToken,
                newClusterData,
                "new",
                setClusterError,
                setTokenExpired
              );

              if (!!result) {
                clusterContext.onNewClusterAdded(false);
              } else {
                if (tokenExpired) {
                  userContext.logoff();
                  setTokenExpired(false);
                }
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
                setClusterError,
                setTokenExpired
              );
            }

            if (!!result) {
              clusterContext.onClusterChanged(false);
              clusterContext.onSetDisableSave(true);
              if (currentType.current === "cluster") {
                navigate(DocumentsRoute);
                setActiveButton(DocumentsRoute);
              } else if (currentType.current === "user_cluster") {
                userContext.onDisplayDialog(true);
              }
            } else {
              if (tokenExpired) {
                userContext.logoff();
                setTokenExpired(false);
              } else if (clusterError) {
                clusterContext.onSetValidationErrors(clusterError);
              }
            }
          }
        } else {
          clusterContext.onSetValidationErrors(validationErrors);
        }
      }
    }
  };

  /**
   * Method to handle the event when the user chooses to dispose of any changes made to the current document.
   */
  const handleAllowDispose = (): void => {
    setOpenConformation(false);

    switch (currentType.current) {
      case "configuration":
        configContext.onDocumentChanged(false);
        configContext.onSetDisableSave(true);
        navigate(ClusterRoute);
        setActiveButton(ClusterRoute);
        break;

      case "user_configuration":
        configContext.onSetRevertChanges(true);
        configContext.onDocumentChanged(false);
        configContext.onSetDisableSave(true);
        userContext.onDisplayDialog(true);
        break;

      case "cluster":
        clusterContext.onClusterChanged(false);
        clusterContext.onSetDisableSave(true);
        navigate(DocumentsRoute);
        setActiveButton(DocumentsRoute);
        break;

      case "user_cluster":
        clusterContext.onSetRevertChanges(true);
        clusterContext.onClusterChanged(false);
        clusterContext.onSetDisableSave(true);
        userContext.onDisplayDialog(true);
        break;

      default:
        break;
    }
  };

  /**
   * Method to handle the event when the user cancels moving away from the dialog.
   */
  const handleCancelMoveAway = (): void => {
    setOpenConformation(false);
  };

  /**
   * Method to get the navigation icon styling.
   *
   * @param {boolean} open True if the navigation group is open; otherwise false.
   * @returns {object} The styling for the navigation icon.
   */
  function navigationIconStyle(open: boolean): object {
    if (open) return { color: adsBlueA };
    else return { color: adsMidGreyA };
  }

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          width: `${navBarWidth}px`,
          borderRight: "1px",
          borderRightColor: adsLightGreyB,
          boxShadow: `4px 0px 9px ${adsLightGreyA50}`,
        }}
      >
        <Grid2
          sx={dataFormStyle("ADSNavContent")}
          container
          direction="column"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid2 sx={{ mt: theme.spacing(1.3) }} size="grow">
            <Stack direction="column" spacing={1} alignItems="center" justifyContent="center">
              <img src="/images/Idox_Logo.svg" alt="IDOX Group" width="36" />
              <Box sx={{ height: 20 }} />
              <Tooltip title="Configuration documents" arrow placement="right" sx={tooltipStyle}>
                <IconButton
                  aria-label="configuration-documents"
                  onClick={handleConfigurationDocumentsClick}
                  size="large"
                >
                  <DocumentScannerIcon fontSize="large" sx={navigationIconStyle(documentsActive)} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cluster groups" arrow placement="right" sx={tooltipStyle}>
                <IconButton aria-label="cluster-groups" onClick={handleClusterGroupsClick} size="large">
                  <GroupsIcon fontSize="large" sx={navigationIconStyle(clusterGroupsActive)} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid2>
          <Grid2>
            <ADSUserAvatar onSaveChanges={handleUserSaveChanges} />
          </Grid2>
        </Grid2>
      </Drawer>
      <ConfirmEditLossDialog
        isOpen={openConformation}
        title="Unsaved changes"
        message="You have made changes to this record, do you want to keep them or discard them?"
        saveText="Save"
        handleSaveClick={handleSaveChanges}
        handleDisposeClick={handleAllowDispose}
        handleReturnClick={handleCancelMoveAway}
      />
    </>
  );
};

export default ADSNavContent;
