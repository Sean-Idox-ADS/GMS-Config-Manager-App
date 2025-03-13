//#region header */
/**************************************************************************************************
//
//  Description: Number control
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

import { Box, Grid2, Skeleton, TextField, Tooltip, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import ADSErrorDisplay from "./ADSErrorDisplay";
import {
  controlLabelStyle,
  FormBoxRowStyle,
  FormInputStyle,
  FormRowStyle,
  skeletonHeight,
  tooltipStyle,
} from "../utils/ADSStyles";

interface ADSNumberControlProps {
  label: string;
  isEditable?: boolean;
  isRequired?: boolean;
  loading?: boolean;
  helperText?: string;
  maximum?: number;
  value: number | string | undefined;
  errorText?: string[];
  onChange: (value: number) => void;
}

const ADSNumberControl: React.FC<ADSNumberControlProps> = ({
  label,
  isEditable = false,
  isRequired = false,
  loading = false,
  helperText,
  maximum,
  value,
  errorText,
  onChange,
}) => {
  const [displayError, setDisplayError] = useState<string | string[] | undefined>("");

  const hasError = useRef<boolean | undefined>(false);

  /**
   * Event to handle when the number changes.
   *
   * @param {object} event The react change event object.
   */
  const handleNumberChangeEvent = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = Number(event.target.value);
    if (!event.target.value || !maximum || newValue <= maximum) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    hasError.current = errorText && errorText.length > 0;

    if (hasError.current) {
      if (Array.isArray(errorText)) setDisplayError(errorText.join(", "));
      else setDisplayError(errorText);
    } else setDisplayError(undefined);
  }, [errorText]);

  return (
    <Box sx={FormBoxRowStyle(hasError.current)}>
      <Grid2 container justifyContent="flex-start" alignItems="center" sx={FormRowStyle(hasError.current)}>
        <Grid2 size={3}>
          <Typography
            id={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
            variant="body2"
            align="left"
            sx={controlLabelStyle}
          >
            {`${label}${isRequired ? "*" : ""}`}
          </Typography>
        </Grid2>
        <Grid2 size={9}>
          {loading ? (
            <Skeleton variant="rectangular" animation="wave" height={`${skeletonHeight}px`} width="100%" />
          ) : helperText && helperText.length > 0 ? (
            <Tooltip
              title={isRequired ? helperText + " This is a required field." : helperText}
              arrow
              placement="right"
              sx={tooltipStyle}
            >
              {maximum && maximum > 0 ? (
                <TextField
                  id={`${label.toLowerCase().replaceAll(" ", "-")}-number-control`}
                  sx={FormInputStyle(hasError.current)}
                  type="number"
                  error={hasError.current}
                  fullWidth
                  disabled={!isEditable}
                  required={isRequired}
                  variant="outlined"
                  margin="dense"
                  size="small"
                  value={value}
                  onChange={handleNumberChangeEvent}
                  aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
                  slotProps={{
                    htmlInput: { max: `${maximum}` },
                  }}
                />
              ) : (
                <TextField
                  id={`${label.toLowerCase().replaceAll(" ", "-")}-number-control`}
                  sx={FormInputStyle(hasError.current)}
                  type="number"
                  error={hasError.current}
                  fullWidth
                  disabled={!isEditable}
                  required={isRequired}
                  variant="outlined"
                  margin="dense"
                  size="small"
                  value={value}
                  onChange={handleNumberChangeEvent}
                  aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
                />
              )}
            </Tooltip>
          ) : maximum && maximum > 0 ? (
            <TextField
              id={`${label.toLowerCase().replaceAll(" ", "-")}-number-control`}
              sx={FormInputStyle(hasError.current)}
              type="number"
              error={hasError.current}
              fullWidth
              disabled={!isEditable}
              required={isRequired}
              variant="outlined"
              margin="dense"
              size="small"
              value={value}
              onChange={handleNumberChangeEvent}
              aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
              slotProps={{
                htmlInput: { max: `${maximum}` },
              }}
            />
          ) : (
            <TextField
              id={`${label.toLowerCase().replaceAll(" ", "-")}-number-control`}
              sx={FormInputStyle(hasError.current)}
              type="number"
              error={hasError.current}
              fullWidth
              disabled={!isEditable}
              required={isRequired}
              variant="outlined"
              margin="dense"
              size="small"
              value={value}
              onChange={handleNumberChangeEvent}
              aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
            />
          )}
        </Grid2>
        {displayError && (
          <ADSErrorDisplay errorText={displayError} id={`${label.toLowerCase().replaceAll(" ", "-")}-number-error`} />
        )}
      </Grid2>
    </Box>
  );
};

export default ADSNumberControl;
