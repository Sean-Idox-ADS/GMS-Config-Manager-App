//#region header */
/**************************************************************************************************
//
//  Description: ADS Text control
//
//  Copyright:    © 2025 Idox Software Limited
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
//#region Version 1.0.0.0 changes
//    001   21.02.25 Sean Flook          GMSCM-1 Initial Revision.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

import React, { ChangeEvent, useEffect, useRef, useState } from "react";

import { CharacterSet, characterSetValidator, isEdgeChromium } from "../utils/HelperUtils";

import { Box, Grid2, IconButton, InputAdornment, Skeleton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import ADSErrorDisplay from "./ADSErrorDisplay";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { controlLabelStyle, FormBoxRowStyle, FormInputStyle, FormRowStyle, tooltipStyle } from "../utils/ADSStyles";
import { adsBlueA } from "../utils/ADSColour";

interface ADSTextControlProps {
  label?: string;
  isEditable?: boolean;
  isRequired?: boolean;
  isFocused?: boolean;
  isHidden?: boolean;
  noLeftPadding?: boolean;
  loading?: boolean;
  displayCharactersLeft?: boolean;
  maxLength: number;
  minLines?: number;
  maxLines?: number;
  helperText?: string;
  value?: string;
  errorText?: string[];
  characterSet?: CharacterSet;
  id: string;
  onChange: (value: string) => void;
}

const ADSTextControl: React.FC<ADSTextControlProps> = ({
  label,
  isEditable = false,
  isRequired = false,
  isFocused = false,
  isHidden = false,
  noLeftPadding = false,
  loading = false,
  displayCharactersLeft = false,
  maxLength,
  minLines = 1,
  maxLines = 1,
  helperText,
  value,
  errorText,
  characterSet = CharacterSet.None,
  id,
  onChange,
}) => {
  const multiline = useRef<boolean>(minLines > 1);

  const [displayValue, setDisplayValue] = useState<string | undefined>("");
  const [displayError, setDisplayError] = useState<string | string[] | undefined>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const inputRef = useRef<any>(null);
  const selectionStart = useRef<number | null>(0);
  const selectionEnd = useRef<number | null>(0);
  const hasError = useRef<boolean | undefined>(false);

  /**
   * Method to get the row size for the control.
   *
   * @returns {number} The row size for the control.
   */
  const GetControlRowSize = (): number => {
    if (multiline.current) return 12;
    else return 9;
  };

  /**
   * Event to handle when the show password button is clicked.
   */
  const handleShowPasswordClick = (): void => {
    setShowPassword(!showPassword);
  };

  /**
   * Event to handle when the mouse button is clicked.
   */
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };

  /**
   * Event to handle when the control changes.
   */
  const handleChangeEvent = (event: ChangeEvent<HTMLInputElement>): void => {
    const valid = characterSetValidator(event.target.value, characterSet);
    selectionStart.current = event.target.selectionStart;
    selectionEnd.current = event.target.selectionEnd;

    if (valid && onChange) {
      setDisplayValue(event.target.value);
      onChange(event.target.value);
    }
  };

  useEffect(() => {
    hasError.current = errorText && errorText.length > 0;

    if (hasError.current) {
      if (Array.isArray(errorText)) setDisplayError(errorText.join(", "));
      else setDisplayError(errorText);
    } else setDisplayError(undefined);
  }, [errorText]);

  useEffect(() => {
    let element = null;

    if (isFocused) {
      element = document.getElementById(`ads-text-textfield-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`);
    }

    if (element) element.focus();
  });

  useEffect(() => {
    setDisplayValue(value);
    if (inputRef.current) {
      inputRef.current.value = value ? value : "";

      inputRef.current.selectionStart = selectionStart.current;
      inputRef.current.selectionEnd = selectionEnd.current;
    }
  }, [value]);

  return (
    <Box sx={FormBoxRowStyle(hasError.current)}>
      <Grid2
        container
        justifyContent="flex-start"
        alignItems={multiline.current ? "flex-start" : "center"}
        sx={FormRowStyle(hasError.current, noLeftPadding)}
      >
        {label ? (
          multiline.current && displayValue && displayValue.length > 0 ? (
            <Grid2 size={12}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography
                  id={`ads-text-label-${label.toLowerCase().replaceAll(" ", "-")}`}
                  variant="body2"
                  align="left"
                  sx={controlLabelStyle}
                >
                  {`${label}${isRequired ? "*" : ""}`}
                </Typography>
                <Typography
                  id={`ads-text-${label ? label.toLowerCase().replaceAll(" ", "-") : id}-characters-left`}
                  variant="body2"
                  align="right"
                  aria-labelledby={`ads-text-label-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
                >
                  {maxLength - displayValue.length} characters left
                </Typography>
              </Stack>
            </Grid2>
          ) : (
            <Grid2 size={3}>
              <Typography
                id={`ads-text-label-${label.toLowerCase().replaceAll(" ", "-")}`}
                variant="body2"
                align="left"
                sx={controlLabelStyle}
              >
                {`${label}${isRequired ? "*" : ""}`}
              </Typography>
            </Grid2>
          )
        ) : (
          <Grid2 size={3}></Grid2>
        )}
        <Grid2 size={GetControlRowSize()}>
          {loading ? (
            <Skeleton variant="rectangular" height="30px" width="100%" />
          ) : helperText && helperText.length > 0 ? (
            <Tooltip
              title={isRequired ? helperText + " This is a required field." : helperText}
              arrow
              placement="right"
              sx={tooltipStyle}
            >
              {multiline.current ? (
                <TextField
                  id={`ads-text-textfield-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
                  sx={FormInputStyle(hasError.current)}
                  error={hasError.current}
                  fullWidth
                  minRows={minLines}
                  maxRows={maxLines}
                  multiline={multiline.current}
                  disabled={!isEditable}
                  required={isRequired}
                  variant="outlined"
                  margin="dense"
                  size="small"
                  value={displayValue}
                  onChange={handleChangeEvent}
                  aria-labelledby={`ads-text-label-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
                  slotProps={{
                    htmlInput: { maxLength: `${maxLength}`, ref: inputRef },
                  }}
                />
              ) : isHidden ? (
                <TextField
                  id={`ads-text-textfield-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
                  sx={FormInputStyle(hasError.current)}
                  type={showPassword ? "text" : "password"}
                  error={hasError.current}
                  rows={1}
                  fullWidth
                  disabled={!isEditable}
                  required={isRequired}
                  variant="outlined"
                  margin="dense"
                  size="small"
                  value={displayValue}
                  onChange={handleChangeEvent}
                  aria-labelledby={`ads-text-label-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
                  slotProps={{
                    htmlInput: {
                      maxLength: `${maxLength}`,
                      ref: inputRef,
                      endAdornment: !isEdgeChromium && (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPassword ? "hide the password" : "display the password"}
                            onClick={handleShowPasswordClick}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            sx={{ "&:hover": { color: adsBlueA } }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              ) : (
                <TextField
                  id={`ads-text-textfield-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
                  sx={FormInputStyle(hasError.current)}
                  error={hasError.current}
                  rows={1}
                  fullWidth
                  disabled={!isEditable}
                  required={isRequired}
                  variant="outlined"
                  margin="dense"
                  size="small"
                  value={displayValue}
                  onChange={handleChangeEvent}
                  aria-labelledby={`ads-text-label-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
                  slotProps={{
                    htmlInput: { maxLength: `${maxLength}`, ref: inputRef },
                  }}
                />
              )}
            </Tooltip>
          ) : multiline.current ? (
            <TextField
              id={`ads-text-textfield-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
              sx={FormInputStyle(hasError.current)}
              error={hasError.current}
              fullWidth
              minRows={minLines}
              maxRows={maxLines}
              multiline={multiline.current}
              disabled={!isEditable}
              required={isRequired}
              variant="outlined"
              margin="dense"
              size="small"
              value={displayValue}
              onChange={handleChangeEvent}
              aria-labelledby={`ads-text-label-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
              slotProps={{
                htmlInput: { maxLength: `${maxLength}`, ref: inputRef },
              }}
            />
          ) : isHidden ? (
            <TextField
              id={`ads-text-textfield-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
              sx={FormInputStyle(hasError.current)}
              type={showPassword ? "text" : "password"}
              error={hasError.current}
              rows={1}
              fullWidth
              disabled={!isEditable}
              required={isRequired}
              variant="outlined"
              margin="dense"
              size="small"
              value={displayValue}
              onChange={handleChangeEvent}
              aria-labelledby={`ads-text-label-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
              slotProps={{
                htmlInput: {
                  maxLength: `${maxLength}`,
                  ref: inputRef,
                  endAdornment: !isEdgeChromium && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "hide the password" : "display the password"}
                        onClick={handleShowPasswordClick}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{
                          "&:hover": {
                            color: adsBlueA,
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          ) : (
            <TextField
              id={`ads-text-textfield-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
              sx={FormInputStyle(hasError.current)}
              error={hasError.current}
              fullWidth
              rows={1}
              disabled={!isEditable}
              required={isRequired}
              variant="outlined"
              margin="dense"
              size="small"
              value={displayValue}
              onChange={handleChangeEvent}
              aria-labelledby={`ads-text-label-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
              slotProps={{
                htmlInput: { maxLength: `${maxLength}`, ref: inputRef },
              }}
            />
          )}
        </Grid2>
        {displayCharactersLeft && displayValue && displayValue.length > 0 ? (
          <Grid2 size={12}>
            <Typography
              id={`ads-text-${label ? label.toLowerCase().replaceAll(" ", "-") : id}-characters-left`}
              variant="body2"
              align="right"
              aria-labelledby={`ads-text-label-${label ? label.toLowerCase().replaceAll(" ", "-") : id}`}
            >
              {maxLength - displayValue.length} characters left
            </Typography>
          </Grid2>
        ) : (
          ""
        )}
        {displayError && (
          <ADSErrorDisplay
            errorText={displayError}
            id={`${label ? label.toLowerCase().replaceAll(" ", "-") : id}-select-error`}
          />
        )}
      </Grid2>
    </Box>
  );
};

export default ADSTextControl;
