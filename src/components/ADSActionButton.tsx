//region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Action Button component
//
//  Copyright:    © 2025 Idox Software Limited.
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
//region Version 1.0.0.0
//    001   24.02.25 Sean Flook          GMSCM-1 Initial Revision.
//endregion Version 1.0.0.0
//
//--------------------------------------------------------------------------------------------------
//endregion header

import React, { MouseEvent, ReactElement } from "react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PreviousIcon from "@mui/icons-material/ChevronLeft";
import NextIcon from "@mui/icons-material/ChevronRight";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/ArrowBack";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PasswordIcon from "@mui/icons-material/Password";
import { CopyIcon, MoveIcon } from "../utils/ADSIcons";
import { adsBlueA, adsMidGreyA, adsWhite } from "../utils/ADSColour";
import { tooltipStyle } from "../utils/ADSStyles";
import { useTheme } from "@mui/material/styles";

export enum ADSActionButtonVariant {
  "add",
  "close",
  "copy",
  "delete",
  "deleteForever",
  "edit",
  "export",
  "home",
  "import",
  "logout",
  "move",
  "moveDown",
  "moveUp",
  "next",
  "previous",
  "return",
  "save",
  "settings",
  "user",
  "users",
  "password",
}

interface ADSActionButtonProps {
  variant: ADSActionButtonVariant;
  buttonLabel?: string;
  disabled?: boolean;
  hidden?: boolean;
  inheritBackground?: boolean;
  tooltipTitle?: string;
  tooltipPlacement?:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "bottom-end"
    | "bottom-start"
    | "left-end"
    | "left-start"
    | "right-end"
    | "right-start"
    | "top-end"
    | "top-start"
    | undefined;
  onClick(event: MouseEvent<HTMLButtonElement>): void;
}

const ADSActionButton: React.FC<ADSActionButtonProps> = ({
  variant,
  buttonLabel,
  disabled,
  hidden,
  inheritBackground,
  tooltipTitle,
  tooltipPlacement,
  onClick,
}) => {
  const theme = useTheme();

  /**
   * Method to get the styling for the action button.
   *
   * @returns {object} The styling for the action button.
   */
  function getActionStyle(): object {
    if (hidden) {
      return { display: "none" };
    } else if (disabled) return { color: theme.palette.text.disabled };
    else if (inheritBackground)
      return {
        backgroundColor: "inherit",
        color: adsMidGreyA,
        "&:hover": {
          color: adsBlueA,
        },
      };
    else
      return {
        backgroundColor: adsWhite,
        color: adsMidGreyA,
        "&:hover": {
          color: adsBlueA,
        },
      };
  }

  /**
   * Event to handle the click event of the button.
   *
   * @param {object} event The event object.
   */
  const handleClickEvent = (event: MouseEvent<HTMLButtonElement>): void => {
    if (onClick) onClick(event);
  };

  /**
   * Method to get the icon to be displayed on the button.
   *
   * @returns {ReactElement} The icon to be displayed on the button.
   */
  const renderIcon = (): ReactElement => {
    let iconComp = null;

    switch (variant) {
      case ADSActionButtonVariant.previous:
        iconComp = <PreviousIcon />;
        break;

      case ADSActionButtonVariant.next:
        iconComp = <NextIcon />;
        break;

      case ADSActionButtonVariant.save:
        iconComp = <SaveIcon />;
        break;

      case ADSActionButtonVariant.delete:
        iconComp = <DeleteIcon />;
        break;

      case ADSActionButtonVariant.deleteForever:
        iconComp = <DeleteForeverOutlinedIcon />;
        break;

      case ADSActionButtonVariant.return:
      case ADSActionButtonVariant.home:
        iconComp = <HomeIcon />;
        break;

      case ADSActionButtonVariant.close:
        iconComp = <CloseIcon />;
        break;

      case ADSActionButtonVariant.copy:
        iconComp = <CopyIcon />;
        break;

      case ADSActionButtonVariant.move:
        iconComp = <MoveIcon />;
        break;

      case ADSActionButtonVariant.moveDown:
        iconComp = <ExpandMoreIcon />;
        break;

      case ADSActionButtonVariant.moveUp:
        iconComp = <ExpandLessIcon />;
        break;

      case ADSActionButtonVariant.user:
        iconComp = <PersonOutlineIcon />;
        break;

      case ADSActionButtonVariant.settings:
        iconComp = <SettingsOutlinedIcon />;
        break;

      case ADSActionButtonVariant.logout:
        iconComp = <LogoutIcon />;
        break;

      case ADSActionButtonVariant.users:
        iconComp = <PeopleOutlineIcon />;
        break;

      case ADSActionButtonVariant.import:
        iconComp = <FileUploadOutlinedIcon />;
        break;

      case ADSActionButtonVariant.export:
        iconComp = <FileDownloadOutlinedIcon />;
        break;

      case ADSActionButtonVariant.edit:
        iconComp = <EditIcon />;
        break;

      case ADSActionButtonVariant.password:
        iconComp = <PasswordIcon />;
        break;

      default:
        iconComp = <AddCircleOutlineIcon />;
        break;
    }

    return (
      <Tooltip title={tooltipTitle} arrow placement={tooltipPlacement} sx={tooltipStyle}>
        <span>
          <IconButton
            sx={getActionStyle()}
            id={`ads-action-button-${buttonLabel ? buttonLabel.toLowerCase().replaceAll(" ", "-") : ""}`}
            size="small"
            disabled={disabled}
            onClick={handleClickEvent}
            aria-label={variant.toString()}
          >
            {iconComp}
            {buttonLabel && buttonLabel.length > 0 && (
              <Typography
                variant="body2"
                sx={{
                  pl: theme.spacing(0.5),
                  pr: theme.spacing(1),
                }}
              >
                {buttonLabel}
              </Typography>
            )}
          </IconButton>
        </span>
      </Tooltip>
    );
  };

  return renderIcon();
};

export default ADSActionButton;
