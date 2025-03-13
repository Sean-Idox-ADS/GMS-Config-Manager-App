// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Add dialog
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
//    002   13.03.25 Sean Flook          GMSCM-1 Added code to handle when a users token has expired.
// endregion Version 1.0.0.0
//
//--------------------------------------------------------------------------------------------------
// endregion header

import React, { ReactElement, SyntheticEvent, useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";

import { lookupToTitleCase } from "../utils/HelperUtils";

import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import ADSDialogTitle from "../components/ADSDialogTitle";

import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

import { blueButtonStyle, FormSelectInputStyle, whiteButtonStyle } from "../utils/ADSStyles";
import { adsDarkGrey } from "../utils/ADSColour";
import { useTheme } from "@mui/material/styles";
import { Organisations } from "../configuration/ADSConfiguration";

export enum AddVariant {
  "clusterOrganisation",
}

interface AddDialogProps<T = any> {
  open: boolean;
  variant: AddVariant;
  onDone: (data: T) => void;
  onClose: () => void;
}

const AddDialog: React.FC<AddDialogProps> = ({ open, variant, onDone, onClose }) => {
  const theme = useTheme();

  const userContext = useContext(UserContext);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [addType, setAddType] = useState<string>("unknown");

  const [organisationName, setOrganisationName] = useState<string | undefined>(undefined);
  const [organisations, setOrganisations] = useState<string[]>([]);

  const [organisationNameError, setOrganisationNameError] = useState<string | undefined>(undefined);
  const [tokenExpired, setTokenExpired] = useState<boolean>(false);

  /**
   * Event to handle when the dialog is closing.
   *
   * @param {object} event The event object.
   * @param {string} reason The reason why the dialog is closing.
   */
  const handleDialogClose = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, reason: string) => {
    event.stopPropagation();
    if (reason === "escapeKeyDown") handleCancelClick();
  };

  /**
   * Event to handle when the cancel button is clicked.
   */
  const handleCancelClick = () => {
    if (onClose) onClose();
    else setShowDialog(false);
  };

  const handleOrganisationNameChange = (event: SyntheticEvent<Element, Event>, newValue: any): void => {
    setOrganisationName(newValue);
  };

  /**
   * Method to determine if the data is valid or not.
   *
   * @returns {boolean} True if the data is valid; otherwise false.
   */
  const dataValid = (): boolean => {
    let validData = true;

    switch (variant) {
      case AddVariant.clusterOrganisation:
        if (!organisationName || organisationName.trim().length === 0) {
          setOrganisationNameError("You must supply the name for the organisation.");
          validData = false;
        } else {
          setOrganisationNameError(undefined);
        }
        break;

      default:
        break;
    }

    return validData;
  };

  /**
   * Method to determine if the data has been changed or not.
   *
   * @returns {boolean} True if the data has been changed; otherwise false.
   */
  const hasDataChanged = (): boolean => {
    let dataChanged = false;

    switch (variant) {
      case AddVariant.clusterOrganisation:
        dataChanged = organisationName !== undefined && organisationName.trim().length > 0;
        break;

      default:
        break;
    }

    return dataChanged;
  };

  /**
   * Method to get the returned data.
   *
   * @returns {object} The returned data object.
   */
  const getReturnData = (): any => {
    switch (variant) {
      case AddVariant.clusterOrganisation:
        return organisationName;

      default:
        break;
    }
  };

  /**
   * Event to handle when the done button is clicked.
   */
  const handleDoneClick = () => {
    if (dataValid()) {
      if (hasDataChanged()) {
        if (onDone) onDone(getReturnData());
      } else handleCancelClick();
    }
  };

  /**
   * Method to get the dialog content depending on the current variant.
   *
   * @returns {ReactElement} The JSX used for the dialog content.
   */
  const getContent = (): ReactElement => {
    switch (variant) {
      case AddVariant.clusterOrganisation:
        return (
          <Grid2 container alignItems="center" rowSpacing={2} columnSpacing={1}>
            <Grid2 size={3}>
              <Typography variant="body1" align="right" id="organisation-label">
                Organisation
              </Typography>
            </Grid2>
            <Grid2 size={9}>
              <Autocomplete
                id={`ads-select-cluster-organisation`}
                sx={{
                  color: "inherit",
                }}
                getOptionLabel={(option) => lookupToTitleCase(option, true)}
                noOptionsText="No organisation records"
                options={organisations}
                autoHighlight
                autoSelect
                value={organisationName}
                onChange={handleOrganisationNameChange}
                renderOption={(props, option) => {
                  return (
                    <li {...props}>
                      <Typography variant="body2" sx={{ color: adsDarkGrey }} align="left">
                        {lookupToTitleCase(option, true)}
                      </Typography>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={FormSelectInputStyle(!!organisationNameError)}
                    error={!!organisationNameError}
                    fullWidth
                    required
                    variant="outlined"
                    margin="dense"
                    size="small"
                    slotProps={{
                      input: {
                        ...params.InputProps,
                      },
                    }}
                  />
                )}
                aria-labelledby="organisation-label"
              />
            </Grid2>
          </Grid2>
        );

      default:
        return <></>;
    }
  };

  useEffect(() => {
    const getOrganisations = async (): Promise<string[] | undefined> => {
      const orgs = await Organisations(userContext.currentToken, setOrganisationNameError, setTokenExpired);
      return orgs;
    };
    switch (variant) {
      case AddVariant.clusterOrganisation:
        setAddType("organisation");
        setOrganisationName(undefined);
        if (!organisations || organisations.length === 0) {
          getOrganisations().then((orgs) => {
            if (orgs) {
              const uniqueOrgs = [...new Set(orgs)];
              setOrganisations(
                uniqueOrgs.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
              );
            }
          });
        }
        break;

      default:
        setAddType("unknown");
        break;
    }
  }, [variant, organisations, userContext.currentToken]);

  useEffect(() => {
    setShowDialog(open);
  }, [open]);

  useEffect(() => {
    if (tokenExpired) {
      userContext.logoff();
      setTokenExpired(false);
    }
  }, [tokenExpired, userContext]);

  return (
    <Dialog open={showDialog} aria-labelledby="edit-lookup-dialog" fullWidth maxWidth="sm" onClose={handleDialogClose}>
      <ADSDialogTitle title={`Add ${addType}`} closeTooltip="Cancel" onClose={handleCancelClick} />
      <DialogContent sx={{ mt: theme.spacing(2) }}>{getContent()}</DialogContent>
      <DialogActions sx={{ justifyContent: "flex-start", mb: theme.spacing(1), ml: theme.spacing(3) }}>
        <Button onClick={handleDoneClick} autoFocus variant="contained" sx={blueButtonStyle} startIcon={<DoneIcon />}>
          Done
        </Button>
        <Button onClick={handleCancelClick} variant="contained" sx={whiteButtonStyle} startIcon={<CloseIcon />}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDialog;
