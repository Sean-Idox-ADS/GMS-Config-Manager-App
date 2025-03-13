//#region header */
/**************************************************************************************************
//
//  Description: Form to display the document information
//
//  Copyright:    © 2025 Idox Software Limited
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
//#region Version 1.0.0.0 changes
//    001   25.02.25 Sean Flook          GMSCM-1 Initial Revision.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

import React, { useContext, useEffect, useState } from "react";

import UserContext from "../context/UserContext";
import ConfigContext from "../context/ConfigContext";

import ConfigDocument from "../models/configDocumentType";

import { Box, Grid2 } from "@mui/material";
import ADSTextControl from "../components/ADSTextControl";
import ADSUserDateControl from "../components/ADSUserDateControl";

import { dataFormStyle, FormRowStyle } from "../utils/ADSStyles";
import ADSReadOnlyControl from "../components/ADSReadOnlyControl";
import ConfigErrorType from "../models/configErrorType";

interface DocumentFormProps {
  data: ConfigDocument;
  errors: ConfigErrorType[] | undefined;
  onDataChange: (data: ConfigDocument) => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ data, errors, onDataChange }) => {
  const userContext = useContext(UserContext);
  const configContext = useContext(ConfigContext);

  const [configType, setConfigType] = useState<string | undefined>();
  const [version, setVersion] = useState<number | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [created, setCreated] = useState<string>();
  const [lastUpdated, setLastUpdated] = useState<string>();
  const [createdBy, setCreatedBy] = useState<string>();
  const [lastUpdatedBy, setLastUpdatedBy] = useState<string>();

  const [nameError, setNameError] = useState<string[] | undefined>();

  /**
   * Method to update the data.
   * @param fieldName The field name to update.
   * @param value The new value.
   */
  const updateData = (fieldName: string, value: string | number | undefined): void => {
    const updatedDocument = {
      ...data,
      [fieldName]: value,
    };

    if (onDataChange) {
      onDataChange(updatedDocument);
    }
  };

  /**
   * Event to handle when the name is changed.
   * @param newValue The new name.
   */
  const handleNameChangeEvent = (newValue: string): void => {
    setName(newValue);
    updateData("name", newValue);
  };

  useEffect(() => {
    if (data) {
      setConfigType(data.configType);
      setVersion(data.version);
      setName(data.name);
      setCreated(data.created);
      setLastUpdated(data.lastUpdated);
      setCreatedBy(data.createdBy);
      setLastUpdatedBy(data.lastUpdatedBy);
    }
  }, [data]);

  useEffect(() => {
    setNameError(undefined);

    if (errors && errors.length > 0) {
      for (const error of errors) {
        switch (error.field) {
          case "name":
            setNameError(error.errors);
            break;

          default:
            break;
        }
      }
    }
  }, [errors]);

  useEffect(() => {
    if (configContext.revertChanges && configContext.originalDocument) {
      setConfigType(configContext.originalDocument.configType);
      setVersion(configContext.originalDocument.version);
      setName(configContext.originalDocument.name);
      setCreated(configContext.originalDocument.created);
      setLastUpdated(configContext.originalDocument.lastUpdated);
      setCreatedBy(configContext.originalDocument.createdBy);
      setLastUpdatedBy(configContext.originalDocument.lastUpdatedBy);
    }
  }, [configContext]);

  return (
    <Box sx={dataFormStyle("DocumentForm")}>
      <Grid2 container justifyContent="flex-start" alignItems="baseline" sx={FormRowStyle()}>
        <Grid2 size={12}>
          <ADSTextControl
            label="Name"
            value={name}
            maxLength={100}
            id="document_name"
            isEditable={userContext.currentUser?.isSuperAdministrator}
            isRequired
            helperText="The name of the document."
            errorText={nameError}
            onChange={handleNameChangeEvent}
          />
          <ADSReadOnlyControl
            label="Configuration type"
            value={configType}
            nullString="configuration type set on save"
          />
          <ADSReadOnlyControl label="Version" value={version?.toString()} nullString="version set on save" />
          <ADSUserDateControl label="Created by" user={createdBy} date={created} />
          <ADSUserDateControl label="Last updated by" user={lastUpdatedBy} date={lastUpdated} />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default DocumentForm;
