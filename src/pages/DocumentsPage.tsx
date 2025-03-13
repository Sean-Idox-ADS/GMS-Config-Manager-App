//#region header */
/**************************************************************************************************
//
//  Description: MT Documents page
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
//    002   25.02.25 Sean Flook          GMSCM-1 Added code to display the data.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

import React, { ReactElement, useCallback, useContext, useEffect, useRef, useState } from "react";

import UserContext from "../context/UserContext";
import ConfigContext from "../context/ConfigContext";

import { ArraysEqual } from "../utils/HelperUtils";

import MultiTenantConfigGetDto, {
  MultiTenantConfigOrganisation,
  MultiTenantConfigPostDto,
  MultiTenantConfigPutDto,
} from "../dtos/multiTenantConfigDto";
import ConfigDocument from "../models/configDocumentType";
import ConfigOrganisation from "../models/configOrganisationType";

import { GetMultiTenantConfig, PostMultiTenantConfig, PutMultiTenantConfig } from "../configuration/ADSConfiguration";

import { Backdrop, Box, Breadcrumbs, Button, CircularProgress, Grid2, Link, Stack, Typography } from "@mui/material";

import DocumentTree from "../forms/DocumentTree";
import DocumentForm from "../forms/DocumentForm";
import OrganisationForm from "../forms/OrganisationForm";
import ElasticNodeForm from "../forms/ElasticNodeForm";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import HubIcon from "@mui/icons-material/Hub";
import SaveIcon from "@mui/icons-material/Save";
import ErrorIcon from "@mui/icons-material/Error";

import { dataFormStyle, getSaveButtonStyle, toolbarStyle } from "../utils/ADSStyles";
import ConfirmEditLossDialog from "../dialogs/ConfirmEditLossDialog";
import ConfigErrorType from "../models/configErrorType";
import { validateConfig } from "../utils/ConfigurationValidation";

interface DocumentsPageProps {}

const DocumentsPage: React.FC<DocumentsPageProps> = () => {
  const userContext = useContext(UserContext);
  const configContext = useContext(ConfigContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string | undefined>(undefined);
  const [configError, setConfigError] = useState<ConfigErrorType[] | undefined>(undefined);
  const [configDocData, setConfigDocData] = useState<ConfigDocument[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<ReactElement[]>([]);
  const [documentFormData, setDocumentFormData] = useState<ConfigDocument | undefined>();
  const [organisationFormData, setOrganisationFormData] = useState<ConfigOrganisation | undefined>();
  const [elasticNodeFormData, setElasticNodeFormData] = useState<string | undefined>();

  const originalConfigDocData = useRef<ConfigDocument[]>([]);
  const originalDocumentFormData = useRef<ConfigDocument | undefined>(undefined);
  const originalOrganisationFormData = useRef<ConfigOrganisation | undefined>(undefined);
  const originalElasticNodeFormData = useRef<string | undefined>(undefined);

  const modifiedItems = useRef<string[]>([]);
  const newSelectedItemId = useRef<string | undefined>(undefined);

  const [enableSave, setEnableSave] = useState<boolean>(false);
  const [openConformation, setOpenConformation] = useState<boolean>(false);
  const [haveErrors, setHaveErrors] = useState<boolean>(false);
  const [errorIds, setErrorIds] = useState<string[]>([]);

  /**
   * Method to get the configuration data.
   *
   * @param {ConfigDocument} doc The configuration document.
   */
  const displayDocumentForm = useCallback(
    (doc: ConfigDocument): void => {
      setBreadcrumbs([
        <Typography key="1" sx={{ color: "text.primary" }}>
          <DescriptionOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {doc?.name}
        </Typography>,
      ]);
      setDocumentFormData(doc);
      originalDocumentFormData.current = doc;
      setOrganisationFormData(undefined);
      originalOrganisationFormData.current = undefined;
      setElasticNodeFormData(undefined);
      originalElasticNodeFormData.current = undefined;
      configContext.onConfigSelected(doc.id);
    },
    [configContext]
  );

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

      if (
        changedDocument &&
        configContext.documentChanged &&
        selectedItemId &&
        modifiedItems.current.includes(selectedItemId.split("|")[0])
      ) {
        // Show a warning message that there are unsaved changes  and ask the user if they want to continue
        // If they say no, then return and do not change the selected item
        // If they say yes, then continue with the change
        setOpenConformation(true);
      } else {
        if (nodeId) {
          if (nodeIds && nodeIds.length > 0) {
            let selectedDoc: ConfigDocument | undefined = configDocData.find((x) => x.id === nodeIds[0]);
            let selectedOrg: ConfigOrganisation | undefined = undefined;
            let selectedNode: string | undefined = undefined;

            if (changedDocument) {
              const clonedDoc = structuredClone(selectedDoc);
              if (clonedDoc) configContext.onSetOriginalDocument(clonedDoc);
            }

            setSelectedItemId(nodeId);
            configContext.onUpdateCurrentConfigItem(nodeId);

            if (selectedDoc && nodeIds.length > 1) {
              selectedOrg = selectedDoc.organisations.find((x) => x.organisationName === nodeIds[1]);

              if (selectedOrg && nodeIds.length > 2) {
                selectedNode = selectedOrg.elasticNodes.find((x) => x === nodeIds[2]);
              }
            }

            if (selectedNode) {
              // Show elastic node information
              setBreadcrumbs([
                <Link
                  underline="hover"
                  key="1"
                  component="button"
                  color="inherit"
                  onClick={() => handleItemSelectedEvent(selectedDoc!.id)}
                >
                  <DescriptionOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  {selectedDoc?.name}
                </Link>,
                <Link
                  underline="hover"
                  key="2"
                  component="button"
                  color="inherit"
                  onClick={() => handleItemSelectedEvent(`${selectedDoc!.id}|${selectedOrg!.organisationName}`)}
                >
                  <CorporateFareIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  {selectedOrg?.organisationName}
                </Link>,
                <Typography key="3" sx={{ color: "text.primary" }}>
                  <HubIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  {selectedNode}
                </Typography>,
              ]);
              setDocumentFormData(undefined);
              originalDocumentFormData.current = undefined;
              setOrganisationFormData(undefined);
              originalOrganisationFormData.current = undefined;
              setElasticNodeFormData(selectedNode);
              originalElasticNodeFormData.current = selectedNode;
              configContext.onConfigSelected(selectedDoc!.id);
              configContext.onOrganisationSelected(selectedOrg!.organisationName);
              configContext.onElasticNodeSelected(selectedNode);
            } else if (selectedOrg) {
              // Show organisation information
              setBreadcrumbs([
                <Link
                  underline="hover"
                  key="1"
                  component="button"
                  color="inherit"
                  onClick={() => handleItemSelectedEvent(selectedDoc!.id)}
                >
                  <DescriptionOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  {selectedDoc?.name}
                </Link>,
                <Typography key="2" sx={{ color: "text.primary" }}>
                  <CorporateFareIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  {selectedOrg?.organisationName}
                </Typography>,
              ]);
              setDocumentFormData(undefined);
              originalDocumentFormData.current = undefined;
              setOrganisationFormData(selectedOrg);
              originalOrganisationFormData.current = selectedOrg;
              setElasticNodeFormData(undefined);
              originalElasticNodeFormData.current = undefined;
              configContext.onConfigSelected(selectedDoc!.id);
              configContext.onOrganisationSelected(selectedOrg?.organisationName);
              configContext.onElasticNodeSelected(undefined);
            } else if (selectedDoc) {
              // Show document information
              configContext.onConfigSelected(selectedDoc!.id);
              configContext.onOrganisationSelected(undefined);
              configContext.onElasticNodeSelected(undefined);
              displayDocumentForm(selectedDoc);
            } else {
              setBreadcrumbs([]);
              setDocumentFormData(undefined);
              originalDocumentFormData.current = undefined;
              setOrganisationFormData(undefined);
              originalOrganisationFormData.current = undefined;
              setElasticNodeFormData(undefined);
              originalElasticNodeFormData.current = undefined;
              configContext.onConfigSelected(undefined);
              configContext.onOrganisationSelected(undefined);
              configContext.onElasticNodeSelected(undefined);
            }
          }
        } else {
          setSelectedItemId(undefined);
          newSelectedItemId.current = undefined;
          configContext.onUpdateCurrentConfigItem(undefined);
          setBreadcrumbs([]);
          setDocumentFormData(undefined);
          originalDocumentFormData.current = undefined;
          setOrganisationFormData(undefined);
          originalOrganisationFormData.current = undefined;
          setElasticNodeFormData(undefined);
          originalElasticNodeFormData.current = undefined;
          configContext.onConfigSelected(undefined);
          configContext.onOrganisationSelected(undefined);
          configContext.onElasticNodeSelected(undefined);
        }
      }
    },
    [configContext, configDocData, selectedItemId, displayDocumentForm]
  );

  /**
   * Method to handle the event when the configuration documents are updated.
   *
   * @param documents The updated configuration documents.
   */
  const updateConfigurationDocuments = useCallback(
    (documents: ConfigDocument[]): void => {
      setConfigDocData(documents);
      configContext.onSetConfigurationDocuments(documents);
    },
    [configContext]
  );

  /**
   * Method to add new items to the configuration document.
   *
   * @param {string} type The type of item to add.
   * @param {string} [id] The id of the currently selected node.
   */
  const handleAddItem = (type: string, id?: string | undefined): void => {
    switch (type) {
      case "config":
        handleAddConfiguration();
        break;

      case "organisation":
        handleAddOrganisation(id!);
        break;

      case "elasticNode":
        handleAddElasticNode(id!);
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
    configContext.onDocumentChanged(modifiedItems.current.length > 0);
    setEnableSave(newList.length > 0);
  };

  /**
   * Method to handle the event when a new configuration is added.
   */
  const handleAddConfiguration = (): void => {
    configContext.onAddNewConfig();

    const newDocument: ConfigDocument = {
      id: "new",
      configType: "MTConfig",
      version: 1,
      name: "_New Configuration",
      created: new Date().toISOString(),
      createdBy: userContext.currentUser?.displayName ?? "",
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: userContext.currentUser?.displayName ?? "",
      organisations: [],
    };

    const updatedConfigurations = [...configDocData];
    updatedConfigurations.push(newDocument);
    updateConfigurationDocuments(updatedConfigurations);

    newSelectedItemId.current = newDocument.id;
    configContext.onSetOriginalDocument(newDocument!);
    setSelectedItemId(newDocument.id);
    configContext.onUpdateCurrentConfigItem(newDocument.id);
    displayDocumentForm(newDocument);
    updateModifiedItems(newDocument.id, true);
    configContext.onDocumentChanged(true);
    setEnableSave(true);
    document.getElementById(newDocument.id!)?.scrollIntoView();
    document.getElementById(newDocument.id!)?.focus();
  };

  /**
   * Method to handle the event when a new organisation is added.
   *
   * @param {string} id The id of the currently selected node.
   */
  const handleAddOrganisation = (id: string): void => {
    const currentConfigurations = [...configDocData];
    const currentConfiguration = currentConfigurations.find((x) => x.id === id);
    if (currentConfiguration) {
      const newOrganisations: ConfigOrganisation[] = currentConfiguration.organisations.filter((x) =>
        x.organisationName.includes("_New Organisation")
      );

      const newOrganisation: ConfigOrganisation = {
        organisationName: `_New Organisation ${newOrganisations.length + 1}`,
        symphonyConnectionString: "",
        server: "",
        database: "",
        userId: "",
        password: "",
        elasticAlias: "",
        elasticNodes: [],
      };

      currentConfiguration.organisations.push(newOrganisation);

      const updatedConfigurations = currentConfigurations.map((x) => (x.id === id ? currentConfiguration : x));
      updateConfigurationDocuments(updatedConfigurations);

      const newExpanded: string[] = [...expanded];
      if (!newExpanded.includes(id)) {
        newExpanded.push(id);
        setExpanded(newExpanded);
      }
      handleItemSelectedEvent(`${id}|${newOrganisation.organisationName}`);
      configContext.onDocumentChanged(true);
      setEnableSave(true);
    }
  };

  /**
   * Method to handle the event when a new elastic node is added.
   *
   * @param {string} id The id of the currently selected node.
   */
  const handleAddElasticNode = (id: string): void => {
    const nodeIds: string[] = id.split("|");
    const currentConfigurations = [...configDocData];
    const currentConfiguration = currentConfigurations.find((x) => x.id === nodeIds[0]);
    if (currentConfiguration) {
      const currentOrganisation = currentConfiguration.organisations.find((x) => x.organisationName === nodeIds[1]);
      if (currentOrganisation) {
        const newElasticNodes: string[] = currentOrganisation.elasticNodes.filter((x) =>
          x.includes("_New Elastic Node")
        );
        const newElasticNode: string = `_New Elastic Node ${newElasticNodes.length + 1}`;
        currentOrganisation.elasticNodes.push(newElasticNode);
        const updatedConfigurations = currentConfigurations.map((x) =>
          x.id === nodeIds[0]
            ? {
                ...x,
                organisations: x.organisations.map((y) =>
                  y.organisationName === nodeIds[1] ? currentOrganisation : y
                ),
              }
            : x
        );
        updateConfigurationDocuments(updatedConfigurations);

        const newExpanded: string[] = [...expanded];
        if (!newExpanded.includes(id)) {
          newExpanded.push(id);
          setExpanded(newExpanded);
        }

        handleItemSelectedEvent(`${id}|${newElasticNode}`);
        configContext.onDocumentChanged(true);
        setEnableSave(true);
      }
    }
  };

  /**
   * Method to handle the event when an item is deleted.
   *
   * @param {string} type The type of item to delete.
   * @param {string} id The id of the item to delete.
   */
  const handleDeleteItem = (type: string, id: string): void => {
    switch (type) {
      case "organisation":
        handleDeleteOrganisation(id);
        break;

      case "elasticNode":
        handleDeleteElasticNode(id);
        break;

      default:
        break;
    }
  };

  /**
   * Method to handle the event when an organisation is deleted.
   *
   * @param {string} id The id of the organisation to delete.
   */
  const handleDeleteOrganisation = (id: string): void => {
    const nodeIds: string[] = id.split("|");
    const currentConfigurations = [...configDocData];
    const currentConfiguration = currentConfigurations.find((x) => x.id === nodeIds[0]);
    if (currentConfiguration) {
      const updatedOrganisations: ConfigOrganisation[] = currentConfiguration.organisations.filter(
        (x) => x.organisationName !== nodeIds[1]
      );
      currentConfiguration.organisations = updatedOrganisations;
      const updatedConfigurations = currentConfigurations.map((x) => (x.id === nodeIds[0] ? currentConfiguration : x));
      updateConfigurationDocuments(updatedConfigurations);
      configContext.onDocumentChanged(true);
      handleItemSelectedEvent(nodeIds[0]);
      updateModifiedItems(nodeIds[0], true);
    }
  };

  /**
   * Method to handle the event when an elastic node is deleted.
   *
   * @param {string} id The id of the elastic node to delete.
   */
  const handleDeleteElasticNode = (id: string): void => {
    const nodeIds: string[] = id.split("|");
    const currentConfigurations = [...configDocData];
    const currentConfiguration = currentConfigurations.find((x) => x.id === nodeIds[0]);
    if (currentConfiguration) {
      const currentOrganisation = currentConfiguration.organisations.find((x) => x.organisationName === nodeIds[1]);
      if (currentOrganisation) {
        const updatedNodes: string[] = currentOrganisation.elasticNodes.filter((x) => x !== nodeIds[2]);
        currentOrganisation.elasticNodes = updatedNodes;
        const updatedConfigurations = currentConfigurations.map((x) =>
          x.id === nodeIds[0]
            ? {
                ...x,
                organisations: x.organisations.map((y) =>
                  y.organisationName === nodeIds[1] ? currentOrganisation : y
                ),
              }
            : x
        );
        updateConfigurationDocuments(updatedConfigurations);
        configContext.onDocumentChanged(true);
        handleItemSelectedEvent(`${nodeIds[0]}|${nodeIds[1]}`);
        updateModifiedItems(nodeIds[0], true);
      }
    }
  };

  /**
   * Method to handle the event when the expanded items are changed.
   *
   * @param items The expanded items.
   */
  const handleExpandedItemsChange = (items: string[]): void => {
    setExpanded(items);
  };

  /**
   * The event to handle when the document data is changed.
   *
   * @param data The document data.
   */
  const handleDocumentDataChanged = (data: ConfigDocument): void => {
    setDocumentFormData(data);
    setBreadcrumbs([
      <Typography key="1" sx={{ color: "text.primary" }}>
        <DescriptionOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        {data?.name}
      </Typography>,
    ]);
    const updatedConfigDocData = configDocData
      .map((doc) => (doc.id === data.id ? data : doc))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
    updateConfigurationDocuments(updatedConfigDocData);
    const documentChanged = !ArraysEqual(
      originalConfigDocData.current.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
      ),
      updatedConfigDocData
    );
    updateModifiedItems(data.id, documentChanged);
  };

  /**
   * The event to handle when the organisation data is changed.
   *
   * @param data The organisation data.
   */
  const handleOrganisationDataChanged = (data: ConfigOrganisation): void => {
    setOrganisationFormData(data);
    if (selectedItemId && selectedItemId.split("|").length > 1) {
      const docId: string = selectedItemId.split("|")[0];
      const originalOrg: string = selectedItemId.split("|")[1];
      const updatedConfigDocData = configDocData
        .map((doc) =>
          doc.id === docId
            ? {
                ...doc,
                organisations: doc.organisations.map((org) => (org.organisationName === originalOrg ? data : org)),
              }
            : doc
        )
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
      updateConfigurationDocuments(updatedConfigDocData);
      if (originalOrg !== data.organisationName) {
        setSelectedItemId(`${docId}|${data.organisationName}`);
      }
      const currentDoc: ConfigDocument | undefined = updatedConfigDocData.find((doc) => doc.id === docId);
      if (currentDoc) {
        setBreadcrumbs([
          <Link
            underline="hover"
            key="1"
            component="button"
            color="inherit"
            onClick={() => handleItemSelectedEvent(currentDoc.id)}
          >
            <DescriptionOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            {currentDoc.name}
          </Link>,
          <Typography key="2" sx={{ color: "text.primary" }}>
            <CorporateFareIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            {data.organisationName}
          </Typography>,
        ]);
      }
      const organisationChanged = !ArraysEqual(
        originalConfigDocData.current.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
        ),
        updatedConfigDocData
      );
      updateModifiedItems(docId, organisationChanged);
    }
  };

  /**
   * Method to handle the change event for the elastic node.
   *
   * @param data The URL of the elastic node.
   */
  const handleElasticNodeChangeEvent = (data: string | undefined): void => {
    setElasticNodeFormData(data);
    if (selectedItemId && selectedItemId.split("|").length > 2) {
      const docId: string = selectedItemId.split("|")[0];
      const orgName: string = selectedItemId.split("|")[1];
      const originalNode: string = selectedItemId.split("|")[2];
      const updatedConfigDocData = data
        ? configDocData
            .map((doc) =>
              doc.id === docId
                ? {
                    ...doc,
                    organisations: doc.organisations.map((org) =>
                      org.organisationName === orgName
                        ? {
                            ...org,
                            elasticNodes: org.elasticNodes.map((node) => (node === originalNode ? data : node)),
                          }
                        : org
                    ),
                  }
                : doc
            )
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }))
        : configDocData
            .map((doc) =>
              doc.id === docId
                ? {
                    ...doc,
                    organisations: doc.organisations.map((org) =>
                      org.organisationName === orgName
                        ? { ...org, elasticNodes: org.elasticNodes.filter((node) => node !== originalNode) }
                        : org
                    ),
                  }
                : doc
            )
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
      updateConfigurationDocuments(updatedConfigDocData);
      setSelectedItemId(data ? `${docId}|${orgName}|${data}` : `${docId}|${orgName}`);
      const currentDoc: ConfigDocument | undefined = updatedConfigDocData.find((doc) => doc.id === docId);
      if (currentDoc) {
        const currentOrg: ConfigOrganisation | undefined = currentDoc.organisations.find(
          (x) => x.organisationName === orgName
        );
        if (currentOrg) {
          setBreadcrumbs([
            <Link
              underline="hover"
              key="1"
              component="button"
              color="inherit"
              onClick={() => handleItemSelectedEvent(currentDoc!.id)}
            >
              <DescriptionOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              {currentDoc?.name}
            </Link>,
            <Link
              underline="hover"
              key="2"
              component="button"
              color="inherit"
              onClick={() => handleItemSelectedEvent(`${currentDoc!.id}|${currentOrg!.organisationName}`)}
            >
              <CorporateFareIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              {currentOrg?.organisationName}
            </Link>,
            <Typography key="3" sx={{ color: "text.primary" }}>
              <HubIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              {data}
            </Typography>,
          ]);
        }
      }
      const nodeChanged = !ArraysEqual(
        originalConfigDocData.current.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
        ),
        updatedConfigDocData
      );
      updateModifiedItems(docId, nodeChanged);
    }
  };

  /**
   * Method to handle the event when the user chooses to save the changes made to the current document.
   *
   * @param {string} nodeId The id of the selected node.
   */
  const handleSaveClicked = async (nodeId: string): Promise<void> => {
    if (nodeId) {
      const nodeIds: string[] = nodeId.split("|");
      const currentDocument: ConfigDocument | undefined = configDocData.find((x) => x.id === nodeIds[0]);

      setConfigError(undefined);

      const validationErrors: ConfigErrorType[] | undefined = validateConfig(configDocData, currentDocument);

      if (!validationErrors || validationErrors.length === 0) {
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

            result = await PostMultiTenantConfig(userContext.currentToken, newConfigData, "new", setConfigError);

            if (!!result) {
              configContext.onNewConfigAdded();
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
              setConfigError
            );
          }

          if (!!result) {
            modifiedItems.current = [];
            let updatedDocuments: ConfigDocument[] = [...configDocData];
            const index: number = updatedDocuments.findIndex((x) => x.id === selectedItemId);

            let organisations: ConfigOrganisation[] = [];
            result.organisations.forEach((org) => {
              const connectionParts: string[] = org.symphonyConnectionString.split(";");
              let server: string = "";
              let database: string = "";
              let userId: string = "";
              let password: string = "";

              connectionParts.forEach((conn) => {
                if (conn.includes("Server=")) {
                  server = conn.replace("Server=", "").trim();
                } else if (conn.includes("Database=")) {
                  database = conn.replace("Database=", "").trim();
                } else if (conn.includes("User ID=")) {
                  userId = conn.replace("User ID=", "").trim();
                } else if (conn.includes("Password=")) {
                  password = conn.replace("Password=", "").trim();
                }
              });

              organisations.push({
                organisationName: org.organisationName,
                symphonyConnectionString: org.symphonyConnectionString,
                server: server,
                database: database,
                userId: userId,
                password: password,
                elasticAlias: org.elasticAlias,
                elasticNodes: org.elasticNodes,
              });
            });

            const configInfo: ConfigDocument = {
              id: result.id,
              configType: result.configType,
              version: result.version,
              name: result.name,
              created: result.created,
              lastUpdated: result.lastUpdated,
              createdBy: result.createdBy,
              lastUpdatedBy: result.lastUpdatedBy,
              organisations: organisations,
            };

            updatedDocuments[index] = configInfo;
            updateConfigurationDocuments(updatedDocuments);

            originalConfigDocData.current = updatedDocuments;

            setEnableSave(false);
            configContext.onDocumentChanged(false);
            if (nodeId.includes("|")) {
              let newId = nodeId.replace(nodeIds[0], result.id);

              switch (nodeIds.length) {
                case 1:
                  handleItemSelectedEvent(newId);
                  document.getElementById(newId!)?.scrollIntoView();
                  break;

                case 2:
                  const oldOrganisation: MultiTenantConfigOrganisation | undefined = result.organisations.find(
                    (x) => x.organisationName === nodeIds[1]
                  );
                  if (oldOrganisation) {
                    handleItemSelectedEvent(newId);
                    document.getElementById(newId!)?.scrollIntoView();
                  } else {
                    const orgIndex: number = currentDocument.organisations.findIndex(
                      (x) => x.organisationName === nodeIds[1]
                    );
                    if (orgIndex > -1) {
                      newId = newId.replace(nodeIds[1], result.organisations[orgIndex].organisationName);
                      handleItemSelectedEvent(newId);
                      document.getElementById(newId!)?.scrollIntoView();
                    }
                  }
                  break;

                case 3:
                  const resultOrgIndex: number = result.organisations.findIndex(
                    (x) => x.organisationName === nodeIds[1]
                  );

                  if (resultOrgIndex > -1) {
                    const oldNode: string | undefined = result.organisations[resultOrgIndex].elasticNodes.find(
                      (x) => x === nodeIds[2]
                    );
                    if (oldNode) {
                      handleItemSelectedEvent(newId);
                      document.getElementById(newId!)?.scrollIntoView();
                    } else {
                      const nodeIndex: number = currentDocument.organisations[resultOrgIndex].elasticNodes.findIndex(
                        (x) => x === nodeIds[2]
                      );
                      if (nodeIndex > -1) {
                        newId = newId.replace(nodeIds[2], result.organisations[resultOrgIndex].elasticNodes[nodeIndex]);
                        handleItemSelectedEvent(newId);
                        document.getElementById(newId!)?.scrollIntoView();
                      }
                    }
                  } else {
                    const orgIndex: number = currentDocument.organisations.findIndex(
                      (x) => x.organisationName === nodeIds[1]
                    );
                    if (orgIndex > -1) {
                      newId = newId.replace(nodeIds[1], result.organisations[orgIndex].organisationName);
                      const oldNode: string | undefined = result.organisations[orgIndex].elasticNodes.find(
                        (x) => x === nodeIds[2]
                      );
                      if (oldNode) {
                        handleItemSelectedEvent(newId);
                        document.getElementById(newId!)?.scrollIntoView();
                      } else {
                        const nodeIndex: number = currentDocument.organisations[resultOrgIndex].elasticNodes.findIndex(
                          (x) => x === nodeIds[2]
                        );
                        if (nodeIndex > -1) {
                          newId = newId.replace(
                            nodeIds[2],
                            result.organisations[resultOrgIndex].elasticNodes[nodeIndex]
                          );
                          handleItemSelectedEvent(newId);
                          document.getElementById(newId!)?.scrollIntoView();
                        }
                      }
                    }
                  }
                  break;

                default:
                  break;
              }
            } else {
              handleItemSelectedEvent(result.id);
              document.getElementById(result.id!)?.scrollIntoView();
            }
          }
        }
      } else {
        setConfigError(validationErrors);
      }
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
   * Method to handle the event when the user chooses to dispose of any changes made to the current document.
   */
  const handleAllowDispose = useCallback((): void => {
    setOpenConformation(false);
    let updatedDocuments: ConfigDocument[] = [...configDocData];
    if (selectedItemId?.split("|")[0] === "new") {
      updatedDocuments = configDocData.filter((x) => x.id !== "new");
    } else {
      const currentDocument: ConfigDocument | undefined = configDocData.find(
        (x) => x.id === selectedItemId?.split("|")[0]
      );
      if (currentDocument && configContext.originalDocument) {
        const index: number = updatedDocuments.findIndex((x) => x.id === selectedItemId?.split("|")[0]);
        updatedDocuments[index] = configContext.originalDocument;

        if (!!documentFormData) {
          setDocumentFormData(configContext.originalDocument);
          originalDocumentFormData.current = configContext.originalDocument;
        } else if (!!organisationFormData) {
          setOrganisationFormData(
            configContext.originalDocument.organisations.find(
              (x) => x.organisationName === configContext.organisationSelected
            )
          );
          originalOrganisationFormData.current = configContext.originalDocument.organisations.find(
            (x) => x.organisationName === configContext.organisationSelected
          );
        } else if (!!elasticNodeFormData) {
          setElasticNodeFormData(
            configContext.originalDocument.organisations
              .find((x) => x.organisationName === configContext.organisationSelected)
              ?.elasticNodes.find((x) => x === configContext.elasticNodeSelected)
          );
          originalElasticNodeFormData.current = configContext.originalDocument.organisations
            .find((x) => x.organisationName === configContext.organisationSelected)
            ?.elasticNodes.find((x) => x === configContext.elasticNodeSelected);
        }
      }
    }

    updateConfigurationDocuments(updatedDocuments);
    originalConfigDocData.current = updatedDocuments;
    modifiedItems.current = [];
    setEnableSave(false);
    setConfigError(undefined);
    handleItemSelectedEvent(newSelectedItemId.current);
    document.getElementById(newSelectedItemId.current!)?.scrollIntoView();
    configContext.onDocumentChanged(false);
  }, [
    configContext,
    configDocData,
    selectedItemId,
    updateConfigurationDocuments,
    handleItemSelectedEvent,
    documentFormData,
    organisationFormData,
    elasticNodeFormData,
  ]);

  /**
   * Method to handle the event when the user cancels moving away from the dialog.
   */
  const handleCancelMoveAway = (): void => {
    setOpenConformation(false);
    document.getElementById(selectedItemId!)?.scrollIntoView();
    document.getElementById(selectedItemId!)?.focus();
    configContext.onClearFilter(true);
  };

  useEffect(() => {
    const GetConfigDocData = async () => {
      if (isLoading) {
        setErrorText("");
        setConfigError(undefined);

        const rawData: MultiTenantConfigGetDto[] | undefined = await GetMultiTenantConfig(
          userContext.currentToken,
          setErrorText
        );

        if (rawData) {
          const configInfo: ConfigDocument[] = [];

          rawData.forEach((doc) => {
            let organisations: ConfigOrganisation[] = [];
            doc.organisations.forEach((org) => {
              const connectionParts: string[] = org.symphonyConnectionString.split(";");
              let server: string = "";
              let database: string = "";
              let userId: string = "";
              let password: string = "";

              connectionParts.forEach((conn) => {
                if (conn.includes("Server=")) {
                  server = conn.replace("Server=", "").trim();
                } else if (conn.includes("Database=")) {
                  database = conn.replace("Database=", "").trim();
                } else if (conn.includes("User ID=")) {
                  userId = conn.replace("User ID=", "").trim();
                } else if (conn.includes("Password=")) {
                  password = conn.replace("Password=", "").trim();
                }
              });

              organisations.push({
                organisationName: org.organisationName,
                symphonyConnectionString: org.symphonyConnectionString,
                server: server,
                database: database,
                userId: userId,
                password: password,
                elasticAlias: org.elasticAlias,
                elasticNodes: org.elasticNodes,
              });
            });

            configInfo.push({
              id: doc.id,
              configType: doc.configType,
              version: doc.version,
              name: doc.name,
              created: doc.created,
              lastUpdated: doc.lastUpdated,
              createdBy: doc.createdBy,
              lastUpdatedBy: doc.lastUpdatedBy,
              organisations: organisations,
            });
          });

          setConfigDocData(configInfo);
          configContext.onSetConfigurationDocuments(configInfo);
          originalConfigDocData.current = configInfo;
          setEnableSave(false);
          setConfigError(undefined);
        } else {
          originalConfigDocData.current = [];
        }
      }
    };

    if (isLoading && !errorText) {
      GetConfigDocData();
    }
  }, [isLoading, errorText, userContext, configContext]);

  useEffect(() => {
    if (!errorText) setIsLoading(!configDocData);
  }, [errorText, configDocData]);

  useEffect(() => {
    setHaveErrors(!!errorText || (configError?.length ?? 0) > 0);

    if (configError && configError.length > 0) {
      const ids: string[] = configError.map((x) => x.id);
      setErrorIds(ids);
    }
  }, [errorText, configError]);

  useEffect(() => {
    if (configContext.disableSave) {
      setEnableSave(false);
      configContext.onSetDisableSave(false);
    }

    if (configContext.revertChanges) {
      handleAllowDispose();
      configContext.onSetRevertChanges(false);
    }
  }, [configContext, handleAllowDispose]);

  useEffect(() => {
    setConfigError(configContext.validationErrors);
  }, [configContext.validationErrors]);

  return isLoading ? (
    <div>
      <Backdrop open={isLoading}>
        Loading data, please wait...
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  ) : (
    <>
      <Box sx={dataFormStyle("ADSDocumentsPageControl")}>
        <Grid2 container justifyContent="flex-start" spacing={0}>
          <Grid2 size={3}>
            <DocumentTree
              data={configDocData}
              selectedItem={selectedItemId}
              expanded={expanded}
              haveErrors={haveErrors}
              errorIds={errorIds}
              onItemSelected={handleItemSelectedEvent}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onExpandedItemsChange={handleExpandedItemsChange}
            />
          </Grid2>
          <Grid2 size={9}>
            <Box sx={toolbarStyle}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ ml: "12px", mt: "6px" }}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                  {breadcrumbs}
                </Breadcrumbs>
                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
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
              </Stack>
            </Box>
            {documentFormData && (
              <DocumentForm data={documentFormData} errors={configError} onDataChange={handleDocumentDataChanged} />
            )}
            {organisationFormData && (
              <OrganisationForm
                data={organisationFormData}
                errors={configError}
                onDataChange={handleOrganisationDataChanged}
              />
            )}
            {elasticNodeFormData && (
              <ElasticNodeForm
                data={elasticNodeFormData}
                errors={configError}
                onDataChange={handleElasticNodeChangeEvent}
              />
            )}
          </Grid2>
        </Grid2>
      </Box>
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

export default DocumentsPage;
