// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Read only control
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

import React, { Fragment, ReactElement, useEffect, useRef, useState } from "react";

import { Box, Button, Grid2, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import ADSErrorDisplay from "./ADSErrorDisplay";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";

import {
  boldControlLabelStyle,
  controlLabelStyle,
  FormBoxReadOnlyRowStyle,
  FormRowStyle,
  tooltipStyle,
  transparentButtonStyle,
} from "../utils/ADSStyles";
import { useTheme } from "@mui/material/styles";

export enum ReadOnlyButtonVariant {
  "none",
  "viewRelated",
  "edit",
}

interface ADSReadOnlyControlProps {
  loading?: boolean;
  noLeftPadding?: boolean;
  boldLabel?: boolean;
  label: string;
  value?: string;
  nullString?: string;
  buttonVariant?: ReadOnlyButtonVariant;
  errorText?: string[];
  onButtonClick?: () => void;
}
const ADSReadOnlyControl: React.FC<ADSReadOnlyControlProps> = ({
  loading = false,
  noLeftPadding = false,
  boldLabel = false,
  label,
  value,
  nullString = "",
  buttonVariant = ReadOnlyButtonVariant.none,
  errorText,
  onButtonClick,
}) => {
  const theme = useTheme();

  const [displayError, setDisplayError] = useState<string | undefined>(undefined);
  const hasError = useRef<boolean>(false);

  /**
   * Event to handle the button click
   */
  const handleButtonClick = (): void => {
    if (onButtonClick) onButtonClick();
  };

  /**
   * Method to get the styling for the control.
   *
   * @returns {object} The styling to use on the control.
   */
  const getValueStyle = (): object | undefined => {
    if (noLeftPadding) return undefined;
    else
      return {
        pl: theme.spacing(2),
      };
  };

  /**
   * Method to get the styling for the tooltip.
   *
   * @return {string} The button tooltip.
   */
  const getButtonTooltip = (): string => {
    switch (buttonVariant) {
      case ReadOnlyButtonVariant.viewRelated:
        return "View all related records";

      case ReadOnlyButtonVariant.edit:
        return `Edit ${label}`;

      default:
        return "";
    }
  };

  /**
   * Method to get the button icon.
   *
   * @returns {ReactElement | null} The icon to be used on the button.
   */
  const getButtonIcon = () => {
    switch (buttonVariant) {
      case ReadOnlyButtonVariant.viewRelated:
        return <ArrowForwardIcon />;

      case ReadOnlyButtonVariant.edit:
        return <EditIcon />;

      default:
        return null;
    }
  };

  /**
   * Method to get the button text.
   *
   * @returns {string} The text to be used on the button
   */
  const getButtonText = (): string => {
    switch (buttonVariant) {
      case ReadOnlyButtonVariant.viewRelated:
        return "All related";

      case ReadOnlyButtonVariant.edit:
        return `Edit ${label}`;

      default:
        return "";
    }
  };

  /**
   * Method to get the button.
   *
   * @return {ReactElement | undefined} The button to be displayed.
   */
  const getButton = (): ReactElement | undefined => {
    switch (buttonVariant) {
      case ReadOnlyButtonVariant.viewRelated:
        return (
          <Fragment>
            <Grid2 size={9}>
              <Typography
                id={`${label.toLowerCase().replaceAll(" ", "-")}-read-only`}
                variant="body1"
                align="left"
                color="textPrimary"
                sx={getValueStyle()}
                aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
              >
                {loading ? <Skeleton animation="wave" /> : value ? value : nullString}
              </Typography>
            </Grid2>
            <Grid2 size={3} />
            <Grid2 size={9}>
              <Tooltip title={getButtonTooltip()} arrow placement="right" sx={tooltipStyle}>
                <Button
                  variant="contained"
                  onClick={handleButtonClick}
                  sx={{ ...transparentButtonStyle, pt: "0px", pb: "0px" }}
                  startIcon={getButtonIcon()}
                >
                  {getButtonText()}
                </Button>
              </Tooltip>
            </Grid2>
          </Fragment>
        );

      case ReadOnlyButtonVariant.edit:
        return (
          <Fragment>
            <Grid2 size={9}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography
                  id={`${label.toLowerCase().replaceAll(" ", "-")}-read-only`}
                  variant="body1"
                  align="left"
                  color="textPrimary"
                  sx={getValueStyle()}
                  aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
                >
                  {loading ? <Skeleton animation="wave" /> : value ? value : nullString}
                </Typography>
                <Tooltip title={getButtonTooltip()} arrow placement="right" sx={tooltipStyle}>
                  <Button
                    variant="contained"
                    onClick={handleButtonClick}
                    sx={{ ...transparentButtonStyle, pt: "0px", pb: "0px" }}
                    startIcon={getButtonIcon()}
                  >
                    {getButtonText()}
                  </Button>
                </Tooltip>
              </Stack>
            </Grid2>
          </Fragment>
        );

      default:
        return undefined;
    }
  };

  useEffect(() => {
    hasError.current = !!errorText && errorText.length > 0;

    if (hasError.current) {
      if (Array.isArray(errorText)) setDisplayError(errorText.join(", "));
      else setDisplayError(errorText);
    } else setDisplayError(undefined);
  }, [errorText]);

  return (
    <Box sx={FormBoxReadOnlyRowStyle(hasError.current)}>
      <Grid2 container justifyContent="flex-start" alignItems="center" sx={FormRowStyle(false)}>
        <Grid2 size={3}>
          <Typography
            id={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
            variant="body2"
            align="left"
            color="textPrimary"
            sx={boldLabel ? boldControlLabelStyle : controlLabelStyle}
          >
            {label}
          </Typography>
        </Grid2>
        {buttonVariant === ReadOnlyButtonVariant.none ? (
          <Grid2 size={9}>
            <Typography
              id={`${label.toLowerCase().replaceAll(" ", "-")}-read-only`}
              variant="body1"
              align="left"
              color="textPrimary"
              sx={getValueStyle()}
              aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
            >
              {loading ? <Skeleton animation="wave" /> : value ? value : nullString}
            </Typography>
          </Grid2>
        ) : (
          getButton()
        )}
        {!!displayError && (
          <ADSErrorDisplay
            errorText={displayError}
            id={`${label.toLowerCase().replaceAll(" ", "-")}-read-only-error`}
          />
        )}
      </Grid2>
    </Box>
  );
};

export default ADSReadOnlyControl;
