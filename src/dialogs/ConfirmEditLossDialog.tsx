// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Confirm Edit Loss Dialog
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

import React, { ReactNode, useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import CircleIcon from "@mui/icons-material/Circle";
import SaveIcon from "@mui/icons-material/Save";
import DiscardIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { adsBlueA, adsLightBlue, adsWhite } from "../utils/ADSColour";

interface ConfirmEditLossDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  associatedRecords?: any[];
  paoChanged?: boolean;
  cascadeChanges?: boolean;
  saveText?: string;
  disposeText?: string;
  handleCascadeChange?: () => void;
  handleSaveClick: () => void;
  handleDisposeClick: () => void;
  handleReturnClick: () => void;
}

const ConfirmEditLossDialog: React.FC<ConfirmEditLossDialogProps> = ({
  isOpen,
  title,
  message,
  associatedRecords,
  paoChanged,
  cascadeChanges,
  saveText = "Save",
  disposeText = "Discard",
  handleCascadeChange,
  handleSaveClick,
  handleDisposeClick,
  handleReturnClick,
}) => {
  const [content, setContent] = useState<ReactNode | null>(null);
  const maxContentHeight = "240px";

  const updateCascadeChanges = useCallback(() => {
    if (handleCascadeChange) handleCascadeChange();
  }, [handleCascadeChange]);

  useEffect(() => {
    setContent(
      <Box sx={{ maxHeight: maxContentHeight }}>
        <Typography variant="body1">{message}</Typography>
        {associatedRecords &&
          associatedRecords.length > 0 &&
          associatedRecords.map((rec, index) => (
            <List dense key={`unsaved_${rec}_${index}`}>
              <ListItem>
                <ListItemIcon>
                  <CircleIcon sx={{ width: "12px", height: "12px" }} />
                </ListItemIcon>
                <ListItemText primary={`${rec} record`} />
              </ListItem>
            </List>
          ))}
        {paoChanged && (
          <FormControlLabel
            control={<Checkbox checked={cascadeChanges} onChange={updateCascadeChanges} />}
            label={"PAO details have been changed, do you want the child records to also be updated?"}
            labelPlacement="start"
          />
        )}
      </Box>
    );
  }, [message, associatedRecords, paoChanged, cascadeChanges, updateCascadeChanges]);

  return (
    <Dialog open={isOpen} aria-labelledby="confirm-edit-loss-dialog" fullWidth maxWidth="xs">
      <DialogTitle id="confirm-edit-loss-dialog">{title ? title : "Unsaved changes"}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions sx={{ justifyContent: "flex-start", pl: "24px", mb: "12px" }}>
        <Button
          onClick={handleSaveClick}
          autoFocus
          variant="contained"
          sx={{
            color: adsWhite,
            backgroundColor: adsBlueA,
            "&:hover": {
              backgroundColor: adsLightBlue,
              color: adsWhite,
            },
          }}
          startIcon={<SaveIcon />}
        >
          {saveText}
        </Button>
        <Button
          onClick={handleDisposeClick}
          sx={{
            color: adsBlueA,
            "&:hover": {
              backgroundColor: adsLightBlue,
              color: adsWhite,
            },
          }}
          startIcon={<DiscardIcon />}
        >
          {disposeText}
        </Button>
        <Button
          onClick={handleReturnClick}
          sx={{
            color: adsBlueA,
            "&:hover": {
              backgroundColor: adsLightBlue,
              color: adsWhite,
            },
          }}
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmEditLossDialog;
