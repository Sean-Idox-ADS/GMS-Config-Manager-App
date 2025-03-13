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
//    002   12.03.25 Sean Flook          GMSCM-1 Added cancel icon as well as adding id.
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
import CancelIcon from "@mui/icons-material/Cancel";
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
  "cancel",
  "settings",
  "user",
  "users",
  "password",
}

interface ADSActionButtonProps {
  id: string;
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
  id,
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
        iconComp = <PreviousIcon id={id} />;
        break;

      case ADSActionButtonVariant.next:
        iconComp = <NextIcon id={id} />;
        break;

      case ADSActionButtonVariant.save:
        iconComp = <SaveIcon id={id} />;
        break;

      case ADSActionButtonVariant.cancel:
        iconComp = <CancelIcon id={id} />;
        break;

      case ADSActionButtonVariant.delete:
        iconComp = <DeleteIcon id={id} />;
        break;

      case ADSActionButtonVariant.deleteForever:
        iconComp = <DeleteForeverOutlinedIcon id={id} />;
        break;

      case ADSActionButtonVariant.return:
      case ADSActionButtonVariant.home:
        iconComp = <HomeIcon id={id} />;
        break;

      case ADSActionButtonVariant.close:
        iconComp = <CloseIcon id={id} />;
        break;

      case ADSActionButtonVariant.copy:
        iconComp = <CopyIcon id={id} />;
        break;

      case ADSActionButtonVariant.move:
        iconComp = <MoveIcon id={id} />;
        break;

      case ADSActionButtonVariant.moveDown:
        iconComp = <ExpandMoreIcon id={id} />;
        break;

      case ADSActionButtonVariant.moveUp:
        iconComp = <ExpandLessIcon id={id} />;
        break;

      case ADSActionButtonVariant.user:
        iconComp = <PersonOutlineIcon id={id} />;
        break;

      case ADSActionButtonVariant.settings:
        iconComp = <SettingsOutlinedIcon id={id} />;
        break;

      case ADSActionButtonVariant.logout:
        iconComp = <LogoutIcon id={id} />;
        break;

      case ADSActionButtonVariant.users:
        iconComp = <PeopleOutlineIcon id={id} />;
        break;

      case ADSActionButtonVariant.import:
        iconComp = <FileUploadOutlinedIcon id={id} />;
        break;

      case ADSActionButtonVariant.export:
        iconComp = <FileDownloadOutlinedIcon id={id} />;
        break;

      case ADSActionButtonVariant.edit:
        iconComp = <EditIcon id={id} />;
        break;

      case ADSActionButtonVariant.password:
        iconComp = <PasswordIcon id={id} />;
        break;

      default:
        iconComp = <AddCircleOutlineIcon id={id} />;
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
