// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Dialog title component
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

import React from "react";

import { DialogTitle, IconButton, Tooltip, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { adsMidGreyA } from "../utils/ADSColour";
import { dialogTitleStyle, dialogTitleTextStyle, tooltipStyle } from "../utils/ADSStyles";

interface ASDDialogTitleProps {
  title: string;
  closeTooltip?: string;
  onClose: () => void;
}

const ADSDialogTitle: React.FC<ASDDialogTitleProps> = ({ title, closeTooltip, onClose }) => {
  const handleCancelClick = (): void => {
    if (onClose) onClose();
  };

  return (
    <DialogTitle id={`ads-dialog-title-${title ? title.toLowerCase().replaceAll(" ", "-") : ""}`} sx={dialogTitleStyle}>
      <Typography sx={dialogTitleTextStyle}>{`${title}`}</Typography>
      {closeTooltip && closeTooltip.length > 0 && (
        <Tooltip title={`${closeTooltip}`} sx={tooltipStyle}>
          <IconButton
            aria-label="close"
            onClick={handleCancelClick}
            sx={{ position: "absolute", right: 12, top: 12, color: adsMidGreyA }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      )}
    </DialogTitle>
  );
};

export default ADSDialogTitle;
