//#region header */
/**************************************************************************************************
//
//  Description: Form to display the organisation information
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

import React, { useContext, useEffect, useRef, useState } from "react";

import UserContext from "../context/UserContext";
import ConfigContext from "../context/ConfigContext";

import ConfigOrganisation from "../models/configOrganisationType";
import ConfigErrorType from "../models/configErrorType";

import { Box, Grid2 } from "@mui/material";
import ADSTextControl from "../components/ADSTextControl";

import { dataFormStyle, FormRowStyle } from "../utils/ADSStyles";

interface OrganisationFormProps {
  data: ConfigOrganisation;
  errors: ConfigErrorType[] | undefined;
  onDataChange: (data: ConfigOrganisation) => void;
}

const OrganisationForm: React.FC<OrganisationFormProps> = ({ data, errors, onDataChange }) => {
  const userContext = useContext(UserContext);
  const configContext = useContext(ConfigContext);

  const [name, setName] = useState<string | undefined>();
  const [server, setServer] = useState<string | undefined>();
  const [database, setDatabase] = useState<string | undefined>();
  const [userId, setUserId] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [elasticAlias, setElasticAlias] = useState<string | undefined>();

  const [nameError, setNameError] = useState<string[] | undefined>();
  const [serverError, setServerError] = useState<string[] | undefined>();
  const [databaseError, setDatabaseError] = useState<string[] | undefined>();
  const [userIdError, setUserIdError] = useState<string[] | undefined>();
  const [passwordError, setPasswordError] = useState<string[] | undefined>();
  const [elasticAliasError, setElasticAliasError] = useState<string[] | undefined>();

  const currentServer = useRef<string | undefined>(undefined);
  const currentDatabase = useRef<string | undefined>(undefined);
  const currentUserId = useRef<string | undefined>(undefined);
  const currentPassword = useRef<string | undefined>(undefined);

  /**
   * Method to update the data when a field is changed.
   *
   * @param fieldName The name of the field that has been updated.
   * @param value The new value for the field.
   */
  const updateData = (fieldName: string, value: string | number | undefined): void => {
    let updatedOrganisation: ConfigOrganisation;
    if (["server", "database", "userId", "password"].includes(fieldName)) {
      updatedOrganisation = {
        ...data,
        [fieldName]: value,
        symphonyConnectionString: `Server=${currentServer.current}; Database=${currentDatabase.current}; User ID=${currentUserId.current}; Password=${currentPassword.current}; Trusted_Connection=false; MultipleActiveResultSets=true; Trust Server Certificate=true;`,
      };
    } else {
      updatedOrganisation = {
        ...data,
        [fieldName]: value,
      };
    }

    if (onDataChange) {
      onDataChange(updatedOrganisation);
    }
  };

  /**
   * Event to handle when the name is changed.
   *
   * @param newValue The new name.
   */
  const handleNameChangeEvent = (newValue: string): void => {
    setName(newValue);
    updateData("organisationName", newValue);
  };

  /**
   * Event to handle when the server is changed.
   *
   * @param newValue The new server.
   */
  const handleServerChangeEvent = (newValue: string): void => {
    setServer(newValue);
    currentServer.current = newValue;
    updateData("server", newValue);
  };

  /**
   * Event to handle when the database is changed.
   *
   * @param newValue The new database.
   */
  const handleDatabaseChangeEvent = (newValue: string): void => {
    setDatabase(newValue);
    currentDatabase.current = newValue;
    updateData("database", newValue);
  };

  /**
   * Event i handle when the user id is changed.
   *
   * @param newValue The new user id.
   */
  const handleUserIdChangeEvent = (newValue: string): void => {
    setUserId(newValue);
    currentUserId.current = newValue;
    updateData("userId", newValue);
  };

  /**
   * Event to handle when the password is changed.
   *
   * @param newValue Th new password.
   */
  const handlePasswordChangeEvent = (newValue: string): void => {
    setPassword(newValue);
    currentPassword.current = newValue;
    updateData("password", newValue);
  };

  /**
   * Event to handle when the elastic alias is changed.
   *
   * @param newValue The new elastic alias.
   */
  const handleElasticAliasChangeEvent = (newValue: string): void => {
    setElasticAlias(newValue);
    updateData("elasticAlias", newValue);
  };

  useEffect(() => {
    if (data) {
      setName(data.organisationName);
      setServer(data.server);
      setDatabase(data.database);
      setUserId(data.userId);
      setPassword(data.password);
      setElasticAlias(data.elasticAlias);

      currentServer.current = data.server;
      currentDatabase.current = data.database;
      currentUserId.current = data.userId;
      currentPassword.current = data.password;
    }
  }, [data]);

  useEffect(() => {
    setNameError(undefined);
    setServerError(undefined);
    setDatabaseError(undefined);
    setUserIdError(undefined);
    setPasswordError(undefined);
    setElasticAliasError(undefined);

    if (errors && errors.length > 0) {
      for (const error of errors) {
        if (error.id === data.organisationName) {
          switch (error.field) {
            case "organisationName":
              setNameError(error.errors);
              break;

            case "server":
              setServerError(error.errors);
              break;

            case "database":
              setDatabaseError(error.errors);
              break;

            case "userId":
              setUserIdError(error.errors);
              break;

            case "password":
              setPasswordError(error.errors);
              break;

            case "elasticAlias":
              setElasticAliasError(error.errors);
              break;

            default:
              break;
          }
        }
      }
    }
  }, [errors, data]);

  useEffect(() => {
    if (configContext.revertChanges && configContext.originalDocument) {
      const originalOrganisation: ConfigOrganisation = configContext.originalDocument.organisations.find(
        (x) => x.organisationName === configContext.organisationSelected
      ) as ConfigOrganisation;

      if (originalOrganisation) {
        setName(originalOrganisation.organisationName);
        setServer(originalOrganisation.server);
        setDatabase(originalOrganisation.database);
        setUserId(originalOrganisation.userId);
        setPassword(originalOrganisation.password);
        setElasticAlias(originalOrganisation.elasticAlias);

        currentServer.current = originalOrganisation.server;
        currentDatabase.current = originalOrganisation.database;
        currentUserId.current = originalOrganisation.userId;
        currentPassword.current = originalOrganisation.password;
      }
    }
  }, [configContext]);

  return (
    <Box sx={dataFormStyle("OrganisationForm")}>
      <Grid2 container justifyContent="flex-start" alignItems="baseline" sx={FormRowStyle()}>
        <Grid2 size={12}>
          <ADSTextControl
            label="Name"
            value={name}
            maxLength={100}
            id="organisation_name"
            isEditable={userContext.currentUser?.isSuperAdministrator}
            isRequired
            helperText="The name of the organisation."
            errorText={nameError}
            onChange={handleNameChangeEvent}
          />
          <ADSTextControl
            label="Server"
            value={server}
            maxLength={100}
            id="server_name"
            isEditable={userContext.currentUser?.isSuperAdministrator}
            isRequired
            helperText="The name of the SQL server."
            errorText={serverError}
            onChange={handleServerChangeEvent}
          />
          <ADSTextControl
            label="Database"
            value={database}
            maxLength={100}
            id="database_name"
            isEditable={userContext.currentUser?.isSuperAdministrator}
            isRequired
            helperText="The name of the database."
            errorText={databaseError}
            onChange={handleDatabaseChangeEvent}
          />
          <ADSTextControl
            label="User"
            value={userId}
            maxLength={100}
            id="user_id"
            isEditable={userContext.currentUser?.isSuperAdministrator}
            isRequired
            helperText="The id of the user to use to connect to the database."
            errorText={userIdError}
            onChange={handleUserIdChangeEvent}
          />
          <ADSTextControl
            label="Password"
            value={password}
            isHidden
            maxLength={100}
            id="user_password"
            isEditable={userContext.currentUser?.isSuperAdministrator}
            isRequired
            helperText="The password for the user used to connect to the database."
            errorText={passwordError}
            onChange={handlePasswordChangeEvent}
          />
          <ADSTextControl
            label="Elastic alias"
            value={elasticAlias}
            maxLength={100}
            id="elastic_alias"
            isEditable={userContext.currentUser?.isSuperAdministrator}
            isRequired
            helperText="The alias for the elastic index."
            errorText={elasticAliasError}
            onChange={handleElasticAliasChangeEvent}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default OrganisationForm;
