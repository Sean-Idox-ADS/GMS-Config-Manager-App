// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Configuration Context
//
//  Copyright:    © 2025 Idox Software Limited.
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
// region Version 1.0.0.0
//    001   04.03.25 Sean Flook          GMSCM-1 Initial Revision.
// endregion Version 1.0.0.0
//
//--------------------------------------------------------------------------------------------------
// endregion header

// region imports

import { createContext, ReactNode, useRef, useState } from "react";
import ConfigContextType from "../models/configContextType";
import ConfigDocument from "../models/configDocumentType";
import ConfigErrorType from "../models/configErrorType";

// endregion imports

/**
 * The configuration context.
 */
const ConfigContext = createContext<ConfigContextType>({} as ConfigContextType);
ConfigContext.displayName = "configContext";

/**
 * Component to provide the configuration context.
 */
type ConfigContextProviderProps = {
  children?: ReactNode;
};

/**
 * Component to provide the configuration context.
 *
 * @param children The children of the component.
 */
export const ConfigContextProvider = ({ children }: ConfigContextProviderProps) => {
  const [currentConfigItem, setCurrentConfigItem] = useState<string | undefined>(undefined);
  const [newConfig, setNewConfig] = useState<boolean>(false);
  const [configSelected, setConfigSelected] = useState<string | undefined>(undefined);
  const [organisationSelected, setOrganisationSelected] = useState<string | undefined>(undefined);
  const [elasticNodeSelected, setElasticNodeSelected] = useState<string | undefined>(undefined);
  const originalDocument = useRef<ConfigDocument | undefined>(undefined);
  const [configurationDocuments, setConfigurationDocuments] = useState<ConfigDocument[]>([]);
  const [clearFilter, setClearFilter] = useState<boolean>(false);
  const [documentChanged, setDocumentChanged] = useState<boolean>(false);
  const [disableSave, setDisableSave] = useState<boolean>(false);
  const [revertChanges, setRevertChanges] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ConfigErrorType[] | undefined>(undefined);

  /**
   * Handle setting the original document.
   *
   * @param {(ConfigDocument | undefined)} document The document to set.
   */
  function HandleSetOriginalDocument(document: ConfigDocument | undefined): void {
    originalDocument.current = document;
  }

  return (
    <ConfigContext.Provider
      value={{
        currentConfigItem: currentConfigItem,
        newConfig: newConfig,
        configSelected: configSelected,
        organisationSelected: organisationSelected,
        elasticNodeSelected: elasticNodeSelected,
        originalDocument: originalDocument.current,
        configurationDocuments: configurationDocuments,
        clearFilter: clearFilter,
        documentChanged: documentChanged,
        disableSave: disableSave,
        revertChanges: revertChanges,
        validationErrors: validationErrors,
        onUpdateCurrentConfigItem: setCurrentConfigItem,
        onAddNewConfig: () => setNewConfig(true),
        onNewConfigAdded: () => setNewConfig(false),
        onConfigSelected: setConfigSelected,
        onOrganisationSelected: setOrganisationSelected,
        onElasticNodeSelected: setElasticNodeSelected,
        onSetOriginalDocument: HandleSetOriginalDocument,
        onSetConfigurationDocuments: setConfigurationDocuments,
        onClearFilter: setClearFilter,
        onDocumentChanged: setDocumentChanged,
        onSetDisableSave: setDisableSave,
        onSetRevertChanges: setRevertChanges,
        onSetValidationErrors: setValidationErrors,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContext;
