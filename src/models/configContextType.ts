// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Configuration Context type
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

import ConfigDocument from "./configDocumentType";
import ConfigErrorType from "./configErrorType";

export default interface ConfigContextType {
  currentConfigItem: string | undefined;
  newConfig: boolean;
  configSelected: string | undefined;
  organisationSelected: string | undefined;
  elasticNodeSelected: string | undefined;
  clearFilter: boolean;
  originalDocument: ConfigDocument | undefined;
  configurationDocuments: ConfigDocument[];
  documentChanged: boolean;
  disableSave: boolean;
  revertChanges: boolean;
  validationErrors: ConfigErrorType[] | undefined;
  onUpdateCurrentConfigItem(newCurrentConfigItem: string | undefined): void;
  onAddNewConfig(): void;
  onNewConfigAdded(): void;
  onConfigSelected(selected: string | undefined): void;
  onOrganisationSelected(selected: string | undefined): void;
  onElasticNodeSelected(selected: string | undefined): void;
  onSetOriginalDocument(document: ConfigDocument): void;
  onSetConfigurationDocuments(documents: ConfigDocument[]): void;
  onClearFilter(clearFilter: boolean): void;
  onDocumentChanged(changed: boolean): void;
  onSetDisableSave(disableSave: boolean): void;
  onSetRevertChanges(revertChanges: boolean): void;
  onSetValidationErrors(errors: ConfigErrorType[] | undefined): void;
}
