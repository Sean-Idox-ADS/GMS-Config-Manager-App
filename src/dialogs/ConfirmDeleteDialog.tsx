// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Confirm Delete Dialog
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

import React, { ReactElement, useEffect, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ADSDialogTitle from "../components/ADSDialogTitle";

import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { deleteDialogContentStyle } from "../utils/ADSStyles";
import { adsBlueA, adsDarkRed, adsPaleBlueA, adsRed, adsWhite } from "../utils/ADSColour";
import { useTheme } from "@mui/material/styles";

export enum DeleteVariant {
  "api",
  "organisation",
}

interface ConfirmDeleteDialogProps {
  open: boolean;
  variant: DeleteVariant;
  recordName?: string;
  onClose: (deleteConfirmed: boolean) => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({ open, variant, recordName, onClose }) => {
  const theme = useTheme();

  const [title, setTitle] = useState<string>("Delete record");
  const [subtitle, setSubtitle] = useState<string | undefined>();
  const [content, setContent] = useState<ReactElement | undefined>();

  /**
   * Event to handle when the cancel button is clicked.
   */
  const handleCancel = (): void => {
    onClose(false);
  };

  /**
   * Event to handle when the OK button is clicked.
   */
  const handleOk = (): void => {
    onClose(true);
  };

  useEffect(() => {
    if (open) {
      switch (variant) {
        case DeleteVariant.api:
          setTitle(recordName ? `Delete the ${recordName} API record` : "Delete API record");
          setSubtitle(undefined);
          setContent(
            <Box sx={deleteDialogContentStyle}>
              <Typography variant="body1">{"On deletion this record"}</Typography>
              <List dense>
                <ListItem key="deleteLine1">
                  <ListItemIcon>
                    <CircleIcon sx={{ width: "12px", height: "12px" }} />
                  </ListItemIcon>
                  <ListItemText primary="will be removed from the list of APIs." />
                </ListItem>
              </List>
            </Box>
          );
          break;

        case DeleteVariant.organisation:
          setTitle(recordName ? `Delete the ${recordName} organisation record` : "Delete organisation record");
          setSubtitle(undefined);
          setContent(
            <Box sx={deleteDialogContentStyle}>
              <Typography variant="body1">{"On deletion this record"}</Typography>
              <List dense>
                <ListItem key="deleteLine1">
                  <ListItemIcon>
                    <CircleIcon sx={{ width: "12px", height: "12px" }} />
                  </ListItemIcon>
                  <ListItemText primary="will be removed from the list of organisations." />
                </ListItem>
              </List>
            </Box>
          );
          break;

        default:
          setTitle("Delete record");
          setSubtitle(undefined);
          setContent(undefined);
          break;
      }
    }
  }, [open, variant, recordName]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      aria-labelledby="confirmation-dialog-title"
      sx={{ p: "16px 16px 24px 16px", borderRadius: "9px" }}
      onClose={handleCancel}
    >
      <ADSDialogTitle title={`${title}`} closeTooltip="Cancel" onClose={handleCancel} />
      <DialogContent sx={{ backgroundColor: theme.palette.background.paper }}>
        {subtitle && (
          <Typography variant="h6" sx={{ pb: theme.spacing(2) }}>
            {subtitle}
          </Typography>
        )}
        {content}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-start", pl: "24px", pb: "24px" }}>
        <Button
          variant="contained"
          onClick={handleOk}
          sx={{
            color: adsWhite,
            backgroundColor: adsRed,
            "&:hover": {
              backgroundColor: adsDarkRed,
            },
          }}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          autoFocus
          sx={{
            color: adsBlueA,
            backgroundColor: adsWhite,
            "&:hover": {
              backgroundColor: adsPaleBlueA,
            },
          }}
          onClick={handleCancel}
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
