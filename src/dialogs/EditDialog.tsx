// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Edit dialog
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

import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";

import ApiGridType from "../models/apiGridType";

import { isValidHttpUrl } from "../utils/HelperUtils";

import { Button, Dialog, DialogActions, DialogContent, Grid2, TextField, Typography } from "@mui/material";
import ADSDialogTitle from "../components/ADSDialogTitle";

import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

import { blueButtonStyle, whiteButtonStyle } from "../utils/ADSStyles";
import { adsRed } from "../utils/ADSColour";
import { useTheme } from "@mui/material/styles";

export enum EditVariant {
  "api",
}

interface EditDialogProps<T = any> {
  open: boolean;
  variant: EditVariant;
  data: T;
  onDone: (data: T) => void;
  onClose: () => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ open, variant, data, onDone, onClose }) => {
  const theme = useTheme();

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [editType, setEditType] = useState<string>("unknown");
  const [dialogMaxWidth, setDialogMaxWidth] = useState<"xs" | "sm" | "md" | "lg" | "xl" | false>("xs");

  const [apiName, setApiName] = useState<string | undefined>(undefined);
  const [apiUrl, setApiUrl] = useState<string | undefined>(undefined);

  const [apiUrlError, setApiUrlError] = useState<string | undefined>(undefined);

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

  /**
   * Event to handle when the API URL has been changed.
   *
   * @param event The change event for the TextField.
   */
  const onApiUrlChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setApiUrl(event.target.value);
  };

  /**
   * Method to determine if the data is valid or not.
   *
   * @returns {boolean} True if the data is valid; otherwise false.
   */
  const dataValid = (): boolean => {
    let validData = true;

    switch (variant) {
      case EditVariant.api:
        if (!apiUrl) {
          setApiUrlError(`You must supply the URL for the ${apiName} API.`);
          validData = false;
        } else if (!apiUrl.startsWith("https://")) {
          setApiUrlError(`The URL must start with 'https://' for the ${apiName} API.`);
          validData = false;
        } else if (!isValidHttpUrl(apiUrl)) {
          setApiUrlError(`The URL is not valid for the ${apiName} API.`);
          validData = false;
        } else {
          setApiUrlError(undefined);
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
      case EditVariant.api:
        const oldApiRecord = data as ApiGridType;
        dataChanged = oldApiRecord.name !== apiName || oldApiRecord.url !== apiUrl;
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
      case EditVariant.api:
        return { id: (data as ApiGridType).id, name: apiName, url: apiUrl };

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
      case EditVariant.api:
        return (
          <Grid2 container alignItems="center" rowSpacing={2}>
            <Grid2 size={2}>
              <Typography variant="body1" align="right" gutterBottom>
                URL
              </Typography>
            </Grid2>
            <Grid2 size={10}>
              <TextField
                variant="outlined"
                error={!!apiUrlError}
                helperText={
                  <Typography variant="caption" sx={{ color: adsRed }} align="left">
                    {apiUrlError}
                  </Typography>
                }
                value={apiUrl}
                fullWidth
                size="small"
                sx={{
                  pl: theme.spacing(1),
                  pr: theme.spacing(1),
                }}
                onChange={onApiUrlChange}
                slotProps={{
                  htmlInput: { maxLength: "100" },
                }}
              />
            </Grid2>
          </Grid2>
        );

      default:
        return <></>;
    }
  };

  useEffect(() => {
    switch (variant) {
      case EditVariant.api:
        setEditType(`${(data as ApiGridType)?.name} API`);
        setApiName((data as ApiGridType)?.name);
        setApiUrl((data as ApiGridType)?.url);
        setDialogMaxWidth("md");
        break;

      default:
        setEditType("unknown");
        break;
    }
  }, [variant, data]);

  useEffect(() => {
    setShowDialog(open);
  }, [open]);

  return (
    <Dialog
      open={showDialog}
      aria-labelledby="edit-dialog"
      fullWidth
      maxWidth={dialogMaxWidth}
      onClose={handleDialogClose}
    >
      <ADSDialogTitle title={`Edit ${editType}`} closeTooltip="Cancel" onClose={handleCancelClick} />
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

export default EditDialog;
