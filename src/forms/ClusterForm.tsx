// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Cluster form
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

import React, { useContext, useEffect, useState } from "react";

import UserContext from "../context/UserContext";

import MultiTenantClusterGetDto from "../dtos/multiTenantClusterDto";

import { Box, Grid2 } from "@mui/material";
import ADSTextControl from "../components/ADSTextControl";
import ADSUserDateControl from "../components/ADSUserDateControl";

import { dataFormStyle, FormRowStyle } from "../utils/ADSStyles";
import ADSReadOnlyControl from "../components/ADSReadOnlyControl";
import ClusterErrorType from "../models/clusterErrorType";

interface ClusterFormProps {
  data: MultiTenantClusterGetDto;
  errors: ClusterErrorType[] | undefined;
  onDataChange: (data: MultiTenantClusterGetDto) => void;
}

const ClusterForm: React.FC<ClusterFormProps> = ({ data, errors, onDataChange }) => {
  const userContext = useContext(UserContext);

  const [configType, setConfigType] = useState<string | undefined>();
  const [version, setVersion] = useState<number | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [application, setApplication] = useState<string | undefined>();
  const [created, setCreated] = useState<string>();
  const [lastUpdated, setLastUpdated] = useState<string>();
  const [createdBy, setCreatedBy] = useState<string>();
  const [lastUpdatedBy, setLastUpdatedBy] = useState<string>();

  const [nameError, setNameError] = useState<string[] | undefined>();
  const [applicationError, setApplicationError] = useState<string[] | undefined>();

  /**
   * Method to update the data.
   * @param fieldName The field name to update.
   * @param value The new value.
   */
  const updateData = (fieldName: string, value: string | undefined): void => {
    const updatedCluster = {
      ...data,
      [fieldName]: value,
    };

    if (onDataChange) {
      onDataChange(updatedCluster);
    }
  };

  /**
   * Event to handle when the name is changed.
   *
   * @param newValue The new name.
   */
  const handleNameChangeEvent = (newValue: string): void => {
    setName(newValue);
    updateData("name", newValue);
  };

  /**
   * Event to handle when the application is changed.
   *
   * @param newValue The new application.
   */
  const handleApplicationChangeEvent = (newValue: string): void => {
    setApplication(newValue);
    updateData("application", newValue);
  };

  useEffect(() => {
    if (data) {
      setConfigType(data.configType);
      setVersion(data.version);
      setName(data.name);
      setApplication(data.application);
      setCreated(data.created);
      setLastUpdated(data.lastUpdated);
      setCreatedBy(data.createdBy);
      setLastUpdatedBy(data.lastUpdatedBy);
    }
  }, [data]);

  useEffect(() => {
    setNameError(undefined);
    setApplicationError(undefined);

    if (errors && errors.length > 0) {
      for (const error of errors) {
        switch (error.field) {
          case "name":
            setNameError(error.errors);
            break;

          case "application":
            setApplicationError(error.errors);
            break;

          default:
            break;
        }
      }
    }
  }, [errors]);

  return (
    <Box sx={dataFormStyle("ClusterForm")}>
      <Grid2 container justifyContent="flex-start" alignItems="baseline" sx={FormRowStyle()} rowSpacing={2}>
        <Grid2 size={12}>
          <ADSTextControl
            label="Name"
            value={name}
            maxLength={100}
            id="cluster_name"
            isEditable={userContext.currentUser?.isSuperAdministrator}
            helperText="The name of the cluster."
            errorText={nameError}
            onChange={handleNameChangeEvent}
          />
          <ADSTextControl
            label="Application"
            value={application}
            maxLength={100}
            id="cluster_application"
            isEditable={userContext.currentUser?.isSuperAdministrator}
            helperText="The application using the cluster."
            errorText={applicationError}
            onChange={handleApplicationChangeEvent}
          />
          <ADSReadOnlyControl label="Type" value={configType} nullString="type set on save" />
          <ADSReadOnlyControl label="Version" value={version?.toString()} nullString="version set on save" />
          <ADSUserDateControl label="Created by" user={createdBy} date={created} />
          <ADSUserDateControl label="Last updated by" user={lastUpdatedBy} date={lastUpdated} />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ClusterForm;
