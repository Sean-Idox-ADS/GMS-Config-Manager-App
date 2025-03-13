//#region header */
/**************************************************************************************************
//
//  Description: Form to display the elastic node information
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

import ConfigErrorType from "../models/configErrorType";
import ConfigOrganisation from "../models/configOrganisationType";

import { Box, Grid2 } from "@mui/material";
import ADSTextControl from "../components/ADSTextControl";

import { dataFormStyle, FormRowStyle } from "../utils/ADSStyles";

interface ElasticNodeFormProps {
  data: string;
  errors: ConfigErrorType[] | undefined;
  onDataChange: (data: string | undefined) => void;
}

const ElasticNodeForm: React.FC<ElasticNodeFormProps> = ({ data, errors, onDataChange }) => {
  const userContext = useContext(UserContext);
  const configContext = useContext(ConfigContext);

  const [elasticNode, setElasticNode] = useState<string | undefined>();

  const [elasticNodeError, setElasticNodeError] = useState<string[] | undefined>();

  /**
   * Event to handle when the elastic node is changed.
   *
   * @param newValue The new elastic node.
   */
  const handleElasticNodeChangeEvent = (newValue: string | undefined): void => {
    setElasticNode(newValue);
    if (onDataChange) {
      onDataChange(newValue);
    }
  };

  useEffect(() => {
    if (data) {
      setElasticNode(data);
    }
  }, [data]);

  useEffect(() => {
    setElasticNodeError(undefined);

    if (errors && errors.length > 0) {
      for (const error of errors) {
        if (error.id === data) {
          switch (error.field) {
            case "elasticNode":
              setElasticNodeError(error.errors);
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
        const originalElasticNode = originalOrganisation.elasticNodes.find(
          (x) => x === configContext.elasticNodeSelected
        );
        if (originalElasticNode) setElasticNode(originalElasticNode);
      }
    }
  }, [configContext]);

  return (
    <Box sx={dataFormStyle("ElasticNodeForm")}>
      <Grid2 container justifyContent="flex-start" alignItems="baseline" sx={FormRowStyle()}>
        <Grid2 size={12}>
          <ADSTextControl
            label="Node"
            value={elasticNode}
            maxLength={100}
            id="elastic_node"
            isEditable={userContext.currentUser?.isSuperAdministrator}
            isRequired
            helperText="The node URL for the elastic index."
            errorText={elasticNodeError}
            onChange={handleElasticNodeChangeEvent}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ElasticNodeForm;
