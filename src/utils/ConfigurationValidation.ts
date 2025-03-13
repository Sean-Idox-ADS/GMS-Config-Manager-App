// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Method to validate the configuration.
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

import ConfigDocument from "../models/configDocumentType";
import ConfigErrorType, { ConfigOrganisationErrorType } from "../models/configErrorType";
import ConfigOrganisation from "../models/configOrganisationType";

/**
 * Method to handle the event when the user chooses to save the changes made to the current document.
 *
 * @param {(ConfigOrganisation | undefined)} data The organisation data.
 * @return {(ConfigOrganisationErrorType[] | undefined)} The validation errors.
 */
export const validateOrganisation = (
  data: ConfigOrganisation | undefined
): ConfigOrganisationErrorType[] | undefined => {
  let organisationErrors: ConfigOrganisationErrorType[] = [];

  if (data) {
    if (!data.organisationName || data.organisationName.trim().length === 0) {
      organisationErrors.push({
        id: data.organisationName,
        field: "organisationName",
        error: "The organisation name is required.",
      });
    }

    if (!data.server || data.server.trim().length === 0) {
      organisationErrors.push({ id: data.organisationName, field: "server", error: "The server name is required." });
    }

    if (!data.database || data.database.trim().length === 0) {
      organisationErrors.push({
        id: data.organisationName,
        field: "database",
        error: "The database name is required.",
      });
    }

    if (!data.userId || data.userId.trim().length === 0) {
      organisationErrors.push({ id: data.organisationName, field: "userId", error: "The user id is required." });
    }

    if (!data.password || data.password.trim().length === 0) {
      organisationErrors.push({ id: data.organisationName, field: "password", error: "The password is required." });
    }

    if (!data.elasticAlias || data.elasticAlias.trim().length === 0) {
      organisationErrors.push({
        id: data.organisationName,
        field: "elasticAlias",
        error: "The elastic alias is required.",
      });
    }

    if (!data.elasticNodes || data.elasticNodes.length === 0) {
      organisationErrors.push({
        id: data.organisationName,
        field: "organisationName",
        error: "At least one elastic node is required.",
      });
    }
  }

  return organisationErrors;
};

/**
 * Method to handle the event when the user chooses to save the changes made to the current document.
 *
 * @param {(ConfigDocument | undefined)} config The configuration document.
 * @return {ConfigErrorType[] | undefined} The validation errors.
 */
export const validateConfig = (
  configDocData: ConfigDocument[],
  config: ConfigDocument | undefined
): ConfigErrorType[] | undefined => {
  let validationErrors: ConfigErrorType[] = [];

  if (config) {
    if (!config.name || config.name.trim().length === 0) {
      validationErrors.push({ id: config.id, field: "name", errors: ["The configuration name is required."] });
    }

    const existingConfig: ConfigDocument | undefined = configDocData.find(
      (x) => x.id !== config.id && x.name === config.name
    );

    if (existingConfig) {
      validationErrors.push({ id: config.id, field: "name", errors: ["The configuration name must be unique."] });
    }

    if (!config.organisations || config.organisations.length === 0) {
      validationErrors.push({ id: config.id, field: "name", errors: ["At least one organisation is required."] });
    } else {
      config.organisations.forEach((org) => {
        const orgErrors: ConfigOrganisationErrorType[] | undefined = validateOrganisation(org);
        if (orgErrors && orgErrors.length > 0) {
          orgErrors.forEach((orgError) => {
            validationErrors.push({ id: orgError.id, field: orgError.field, errors: [orgError.error] });
          });
        }

        const duplicateOrg: ConfigOrganisation[] | undefined = config.organisations.filter(
          (x) => x.organisationName === org.organisationName
        );

        if (duplicateOrg && duplicateOrg.length > 1) {
          validationErrors.push({
            id: org.organisationName,
            field: "organisationName",
            errors: ["The organisation name must be unique."],
          });
        }

        if (org.elasticNodes && org.elasticNodes.length > 0) {
          org.elasticNodes.forEach((node) => {
            if (!node || node.trim().length === 0) {
              validationErrors.push({
                id: node,
                field: "elasticNodes",
                errors: ["The elastic node name is required."],
              });
            }
            const duplicateNode: string[] | undefined = org.elasticNodes.filter((x) => x === node);
            if (duplicateNode && duplicateNode.length > 1) {
              validationErrors.push({
                id: node,
                field: "elasticNodes",
                errors: ["The elastic node name must be unique."],
              });
            }
          });
        }
      });
    }
  }

  return validationErrors;
};
