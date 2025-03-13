// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Select control
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

import React, { Fragment, ReactElement, SyntheticEvent, useEffect, useRef, useState } from "react";

import { SyncAlt as TwoWayIcon } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { StartToEndIcon, EndToStartIcon } from "../utils/ADSIcons";
import { adsBlack, adsBlueA, adsDarkGrey, adsLightGreyA, adsRed, adsWhite, adsYellow } from "../utils/ADSColour";
import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Grid2,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ActionIconStyle,
  controlLabelStyle,
  FormBoxRowStyle,
  FormInputStyle,
  FormRowStyle,
  FormSelectInputStyle,
  skeletonHeight,
  tooltipStyle,
} from "../utils/ADSStyles";
import { lookupToTitleCase } from "../utils/HelperUtils";
import ADSErrorDisplay from "./ADSErrorDisplay";

interface ADSSelectControlProps {
  label: string;
  isEditable?: boolean;
  isRequired?: boolean;
  isFocused?: boolean;
  includeHistoric?: boolean;
  doNotSetTitleCase?: boolean;
  loading?: boolean;
  useRounded?: boolean;
  isCrossRef?: boolean;
  isClassification?: boolean;
  includeHiddenCode?: boolean;
  displayNoChange?: boolean;
  indicateChange?: boolean;
  allowAddLookup?: boolean;
  lookupData: any[];
  lookupId: string;
  lookupLabel: string;
  lookupColour?: string;
  lookupIcon?: string;
  lookupHistoric?: string;
  helperText?: string;
  value?: any;
  errorText?: string[];
  onChange: (id: number | null) => void;
  onAddLookup?: () => void;
}

const ADSSelectControl: React.FC<ADSSelectControlProps> = ({
  label,
  isEditable = false,
  isRequired = false,
  isFocused = false,
  includeHistoric = false,
  doNotSetTitleCase = false,
  loading = false,
  useRounded = false,
  isCrossRef = false,
  isClassification = false,
  includeHiddenCode = false,
  displayNoChange = false,
  indicateChange = false,
  allowAddLookup = false,
  lookupData,
  lookupId,
  lookupLabel,
  lookupColour,
  lookupIcon,
  lookupHistoric,
  helperText,
  value,
  errorText,
  onChange,
  onAddLookup,
}) => {
  const [displayError, setDisplayError] = useState<string | undefined>("");
  const hasError = useRef<boolean | undefined>(false);
  const [options, setOptions] = useState<any[]>([]);
  const [controlValue, setControlValue] = useState<string | undefined>("");
  const [currentValue, setCurrentValue] = useState<string | undefined>("");
  const [controlFocused, setControlFocused] = useState<boolean | undefined>(false);

  /**
   * Event to handle when the control value changes.
   *
   * @param {object} event The event object.
   * @param {string} newValue The updated value
   */
  const handleChangeEvent = (event: SyntheticEvent<Element, Event>, newValue: any): void => {
    const updatedValue = stripCodeFromValue(newValue);

    setControlValue(updatedValue);

    if (onChange) {
      const selectedItem = getSelectedItem(updatedValue);
      if (selectedItem) onChange(selectedItem[lookupId]);
      else onChange(null);
    }
  };

  /**
   * Event to handle when the control is focused.
   *
   * @param {object} event The event object
   */
  const handleFocus = (event: React.FocusEvent<HTMLDivElement, Element>): void => {
    event.stopPropagation();
    setControlFocused(true);
  };

  /**
   * Event to handle when the control looses focus.
   *
   * @param {object} event The event object
   */
  const handleBlur = (event: React.FocusEvent<HTMLDivElement, Element>): void => {
    event.stopPropagation();
    setControlFocused(false);
  };

  /**
   * Event to handle when the add lookup button is clicked.
   */
  const handleAddLookup = () => {
    if (onAddLookup) onAddLookup();
  };

  /**
   * Method to get the icon.
   *
   * @param {string} iconInfo The icon information either type of URL.
   * @param {string} backgroundColour The background colour to use for the icon.
   * @returns {ReactElement} The icon.
   */
  function getIcon(iconInfo: string, backgroundColour: string): ReactElement {
    switch (iconInfo) {
      case "TwoWay":
        return (
          <TwoWayIcon
            sx={{
              color: adsWhite,
              backgroundColor: backgroundColour,
            }}
          />
        );

      case "StartToEnd":
        return (
          <StartToEndIcon
            sx={{
              color: adsWhite,
              backgroundColor: backgroundColour,
            }}
          />
        );

      case "EndToStart":
        return (
          <EndToStartIcon
            sx={{
              color: adsWhite,
              backgroundColor: backgroundColour,
            }}
          />
        );

      default:
        return <img src={iconInfo} alt="" width="20" height="20" />;
    }
  }

  /**
   * Method to get the lookup information.
   *
   * @param {number} value The id of the lookup.
   * @returns {ReactElement} The display of the lookup item.
   */
  const getLookupInfo = (value: number): ReactElement | undefined => {
    if (lookupData) {
      const currentRow = lookupData.find((x) => x[lookupId] === value);

      if (currentRow) {
        if (lookupIcon && currentRow[lookupIcon] && currentRow[lookupIcon].length !== 0) {
          return (
            <TextField
              id={`${label.toLowerCase().replaceAll(" ", "-")}-lookup-info`}
              sx={FormInputStyle(hasError.current)}
              error={hasError.current}
              fullWidth
              disabled
              required={isRequired}
              variant="outlined"
              margin="dense"
              size="small"
              value={lookupToTitleCase(currentRow[lookupLabel], doNotSetTitleCase)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      {getIcon(currentRow[lookupIcon], lookupColour ? currentRow[lookupColour] : adsBlueA)}
                    </InputAdornment>
                  ),
                },
              }}
            />
          );
        } else {
          return (
            <TextField
              id={`${label.toLowerCase().replaceAll(" ", "-")}-lookup-info`}
              sx={FormInputStyle(hasError.current)}
              error={hasError.current}
              rows={1}
              fullWidth
              disabled
              required={isRequired}
              variant="outlined"
              margin="dense"
              size="small"
              value={lookupToTitleCase(currentRow[lookupLabel], doNotSetTitleCase)}
            />
          );
        }
      } else {
        return (
          <TextField
            id={`${label.toLowerCase().replaceAll(" ", "-")}-lookup-info`}
            sx={FormInputStyle(hasError.current)}
            error={hasError.current}
            rows={1}
            fullWidth
            disabled
            required={isRequired}
            variant="outlined"
            margin="dense"
            size="small"
            value={""}
          />
        );
      }
    } else return undefined;
  };

  /**
   * Method to get the avatar text styling.
   *
   * @param {object} selectedItem The selected record.
   * @returns {object} The styling for the avatar text.
   */
  function getAvatarTextStyle(selectedItem: any): object | undefined {
    if (!lookupColour) return undefined;

    switch (lookupColour.includes("#") ? lookupColour : selectedItem[lookupColour]) {
      case adsYellow:
      case adsLightGreyA:
        return {
          color: adsBlack,
          fontWeight: 500,
          fontFamily: "Open Sans",
        };

      default:
        return {
          color: adsWhite,
          fontWeight: 500,
          fontFamily: "Open Sans",
        };
    }
  }

  /**
   * Method to strip the code from the supplied value.
   *
   * @param {string} value The value from the control.
   * @returns {string} The code within the value.
   */
  const stripCodeFromValue = (value: string | undefined): string | undefined => {
    if (!value) return value;

    if (includeHiddenCode && value && value.indexOf("|") !== -1) return value.substring(0, value.indexOf("|"));
    else return value;
  };

  /**
   * Method to get the item avatar.
   *
   * @param {string} value The control value.
   * @returns {ReactElement} The item avatar.
   */
  function getItemAvatar(value: string | undefined): ReactElement | undefined {
    const selectedItem = getSelectedItem(stripCodeFromValue(value));

    if (selectedItem) {
      return (
        <Avatar
          id={`${label.toLowerCase().replaceAll(" ", "-")}-avatar`}
          variant={useRounded ? "rounded" : "circular"}
          sx={getAvatarColour(stripCodeFromValue(value))}
          aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
        >
          {lookupIcon && selectedItem[lookupIcon] && selectedItem[lookupIcon].length > 0 ? (
            getIcon(selectedItem[lookupIcon], lookupColour ? selectedItem[lookupColour] : adsBlueA)
          ) : (
            <Typography variant="caption" sx={getAvatarTextStyle(selectedItem)}>
              {getAvatarValue(stripCodeFromValue(value))}
            </Typography>
          )}
        </Avatar>
      );
    } else return undefined;
  }

  /**
   * Method to get the avatar value.
   *
   * @param {string} value The control value
   * @returns {string|null} The avatar value.
   */
  function getAvatarValue(value: string | undefined): string | null {
    const selectedItem = getSelectedItem(value);

    if (selectedItem) {
      if (!isCrossRef) return selectedItem[lookupId];
      else if (selectedItem.xrefSourceRef73) return selectedItem.xrefSourceRef73.substring(4, 6);
      else if (selectedItem.xrefSourceRef) return selectedItem.xrefSourceRef.substring(0, 2);
      else return null;
    } else return null;
  }

  /**
   * Method to get the selected item.
   *
   * @param {string} value The display value for the control
   * @returns {object|null} The lookup row with the given label.
   */
  function getSelectedItem(value: string | undefined): any {
    if (!lookupData || !value) return null;
    return lookupData.find((x) => x[lookupLabel] === value);
  }

  /**
   * Method to get the avatar colour and styling.
   *
   * @param {string} value The display value for the control
   * @returns {object} The styling for the avatar.
   */
  function getAvatarColour(value: string | undefined): object {
    const selectedItem = getSelectedItem(value);

    if (selectedItem && lookupColour) {
      const avatarColour = lookupColour.includes("#") ? lookupColour : selectedItem[lookupColour];
      const avatarWidth =
        selectedItem[lookupId].toString().length <= 2
          ? "24px"
          : selectedItem[lookupId].toString().length <= 3
          ? "36px"
          : "48px";

      return {
        backgroundColor: avatarColour,
        height: "24px",
        width: avatarWidth,
      };
    } else
      return {
        backgroundColor: adsBlueA,
        width: "24px",
        height: "24px",
      };
  }

  /**
   * Method to determine if the item is historic.
   *
   * @param {string} value The display value for the control
   * @returns {boolean} True if the item is a historic item; otherwise false.
   */
  function isHistoric(value: string): boolean {
    const selectedItem = getSelectedItem(stripCodeFromValue(value));

    if (selectedItem && lookupHistoric) return selectedItem[lookupHistoric];
    else return false;
  }

  useEffect(() => {
    hasError.current = errorText && errorText.length > 0;

    if (hasError.current) {
      if (Array.isArray(errorText)) setDisplayError(errorText.join(", "));
      else setDisplayError(errorText);
    } else setDisplayError(undefined);

    if (lookupData && lookupData.length > 0) {
      if (includeHiddenCode) {
        if (includeHistoric) {
          const mappedData = lookupData.map((a) => `${a[lookupLabel]}|${a[lookupId]}`);
          if (mappedData.length !== options.length) setOptions(mappedData);
        } else if (lookupHistoric) {
          const filteredData = lookupData
            .filter((x) => !x[lookupHistoric])
            .map((a) => `${a[lookupLabel]}|${a[lookupId]}`);
          if (filteredData.length !== options.length) setOptions(filteredData);
        }
      } else {
        if (includeHistoric) {
          const mappedData = lookupData.map((a) => a[lookupLabel]);
          if (mappedData.length !== options.length) setOptions(mappedData);
        } else if (lookupHistoric) {
          const filteredData = lookupData.filter((x) => !x[lookupHistoric]).map((a) => a[lookupLabel]);
          if (filteredData.length !== options.length) setOptions(filteredData);
        }
      }
    } else if (options.length) setOptions([]);
  }, [errorText, includeHistoric, includeHiddenCode, lookupData, lookupLabel, lookupId, lookupHistoric, options]);

  useEffect(() => {
    if ((!controlValue || currentValue !== value) && lookupData) {
      const selectedItem = lookupData.find(
        (x) =>
          (x[lookupId] || x[lookupId] === 0) && (value || value === 0) && x[lookupId].toString() === value.toString()
      );

      if (selectedItem) {
        setControlValue(selectedItem[lookupLabel]);
      } else {
        setControlValue(undefined);
      }

      setCurrentValue(value);
    } else if (!value && value !== 0) {
      setControlValue(undefined);
    }
  }, [lookupData, controlValue, currentValue, value, lookupId, lookupLabel]);

  useEffect(() => {
    let element = null;

    if (isFocused) {
      element = document.getElementById(`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`);
    }

    if (element) element.focus();
  });

  return (
    <Box sx={FormBoxRowStyle(hasError.current)}>
      <Grid2 container justifyContent="flex-start" alignItems="center" sx={FormRowStyle(hasError.current)}>
        <Grid2 size={3}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mr: "16px" }}>
            <Typography
              id={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
              variant="body2"
              align="left"
              sx={controlLabelStyle}
            >
              {`${label === "Street classification" ? "Classification" : label}${isRequired ? "*" : ""}`}
            </Typography>
            <Badge color="error" variant="dot" invisible={!indicateChange} />
          </Stack>
        </Grid2>
        <Grid2 size={9}>
          {loading ? (
            <Skeleton variant="rectangular" animation="wave" height={`${skeletonHeight}px`} width="100%" />
          ) : isEditable ? (
            helperText && helperText.length > 0 ? (
              lookupColour ? (
                isClassification ? (
                  <Tooltip
                    title={isRequired ? helperText + " This is a required field." : helperText}
                    arrow
                    placement="right"
                    sx={tooltipStyle}
                  >
                    <Autocomplete
                      id={`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`}
                      sx={{
                        color: "inherit",
                      }}
                      getOptionLabel={(option) => lookupToTitleCase(option, doNotSetTitleCase)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      noOptionsText={`No ${label === "Street classification" ? "Classification" : label} records`}
                      options={options}
                      value={controlValue}
                      autoHighlight
                      autoSelect
                      onChange={handleChangeEvent}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      renderOption={(props, option) => {
                        return (
                          <li {...props}>
                            <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                              {lookupColour && getItemAvatar(option)}
                              {includeHiddenCode ? (
                                <Fragment>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                                    align="left"
                                  >
                                    {lookupToTitleCase(
                                      option ? option.substring(0, option.indexOf("|")) : option,
                                      doNotSetTitleCase
                                    )}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      visibility: "hidden",
                                      color: `${includeHistoric && isHistoric(option) ? adsRed : "textDisabled"}`,
                                    }}
                                    align="left"
                                  >
                                    {option ? option.substring(option.indexOf("|") + 1) : option}
                                  </Typography>
                                </Fragment>
                              ) : (
                                <Typography
                                  variant="body2"
                                  sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                                  align="left"
                                >
                                  {lookupToTitleCase(option, doNotSetTitleCase)}
                                </Typography>
                              )}
                            </Stack>
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={FormSelectInputStyle(hasError.current)}
                          error={hasError.current}
                          fullWidth
                          disabled={!isEditable}
                          required={isRequired}
                          placeholder={displayNoChange ? "No change" : undefined}
                          variant="outlined"
                          margin="dense"
                          size="small"
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">{getItemAvatar(controlValue)}</InputAdornment>
                              ),
                            },
                          }}
                        />
                      )}
                      aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
                    />
                  </Tooltip>
                ) : allowAddLookup && controlFocused ? (
                  <Tooltip
                    title={isRequired ? helperText + " This is a required field." : helperText}
                    arrow
                    placement="right"
                    sx={tooltipStyle}
                  >
                    <Autocomplete
                      id={`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`}
                      sx={{
                        color: "inherit",
                      }}
                      getOptionLabel={(option) => lookupToTitleCase(option, doNotSetTitleCase)}
                      noOptionsText={`No ${label === "Street classification" ? "Classification" : label} records`}
                      options={options}
                      value={controlValue}
                      autoHighlight
                      autoSelect
                      onChange={handleChangeEvent}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      renderOption={(props, option) => {
                        return (
                          <li {...props}>
                            <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                              {lookupColour && getItemAvatar(option)}
                              {includeHiddenCode ? (
                                <Fragment>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                                    align="left"
                                  >
                                    {lookupToTitleCase(
                                      option ? option.substring(0, option.indexOf("|")) : option,
                                      doNotSetTitleCase
                                    )}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      visibility: "hidden",
                                      color: `${includeHistoric && isHistoric(option) ? adsRed : "textDisabled"}`,
                                    }}
                                    align="left"
                                  >
                                    {option ? option.substring(option.indexOf("|") + 1) : option}
                                  </Typography>
                                </Fragment>
                              ) : (
                                <Typography
                                  variant="body2"
                                  sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                                  align="left"
                                >
                                  {lookupToTitleCase(option, doNotSetTitleCase)}
                                </Typography>
                              )}
                            </Stack>
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={FormSelectInputStyle(hasError.current)}
                          error={hasError.current}
                          fullWidth
                          disabled={!isEditable}
                          required={isRequired}
                          placeholder={displayNoChange ? "No change" : undefined}
                          variant="outlined"
                          margin="dense"
                          size="small"
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">{getItemAvatar(controlValue)}</InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    id="btnClear"
                                    onClick={handleAddLookup}
                                    aria-label="add button"
                                    size="small"
                                  >
                                    <AddCircleOutlineIcon sx={ActionIconStyle()} />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      )}
                      aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={isRequired ? helperText + " This is a required field." : helperText}
                    arrow
                    placement="right"
                    sx={tooltipStyle}
                  >
                    <Autocomplete
                      id={`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`}
                      sx={{
                        color: "inherit",
                      }}
                      getOptionLabel={(option) => lookupToTitleCase(option, doNotSetTitleCase)}
                      noOptionsText={`No ${label === "Street classification" ? "Classification" : label} records`}
                      options={options}
                      value={controlValue}
                      autoHighlight
                      autoSelect
                      onChange={handleChangeEvent}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      renderOption={(props, option) => {
                        return (
                          <li {...props}>
                            <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                              {lookupColour && getItemAvatar(option)}
                              {includeHiddenCode ? (
                                <Fragment>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                                    align="left"
                                  >
                                    {lookupToTitleCase(
                                      option ? option.substring(0, option.indexOf("|")) : option,
                                      doNotSetTitleCase
                                    )}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      visibility: "hidden",
                                      color: `${includeHistoric && isHistoric(option) ? adsRed : "textDisabled"}`,
                                    }}
                                    align="left"
                                  >
                                    {option ? option.substring(option.indexOf("|") + 1) : option}
                                  </Typography>
                                </Fragment>
                              ) : (
                                <Typography
                                  variant="body2"
                                  sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                                  align="left"
                                >
                                  {lookupToTitleCase(option, doNotSetTitleCase)}
                                </Typography>
                              )}
                            </Stack>
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={FormSelectInputStyle(hasError.current)}
                          error={hasError.current}
                          fullWidth
                          disabled={!isEditable}
                          required={isRequired}
                          placeholder={displayNoChange ? "No change" : undefined}
                          variant="outlined"
                          margin="dense"
                          size="small"
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">{getItemAvatar(controlValue)}</InputAdornment>
                              ),
                            },
                          }}
                        />
                      )}
                      aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
                    />
                  </Tooltip>
                )
              ) : isClassification ? (
                <Tooltip
                  title={isRequired ? helperText + " This is a required field." : helperText}
                  arrow
                  placement="right"
                  sx={tooltipStyle}
                >
                  <Autocomplete
                    id={`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`}
                    sx={{
                      color: "inherit",
                    }}
                    getOptionLabel={(option) => lookupToTitleCase(option, doNotSetTitleCase)}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    noOptionsText={`No ${label === "Street classification" ? "Classification" : label} records`}
                    options={options}
                    value={controlValue}
                    autoHighlight
                    autoSelect
                    onChange={handleChangeEvent}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    renderOption={(props, option) => {
                      return (
                        <li {...props}>
                          <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                            {lookupColour && getItemAvatar(option)}
                            {includeHiddenCode ? (
                              <Fragment>
                                <Typography
                                  variant="body2"
                                  sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                                  align="left"
                                >
                                  {lookupToTitleCase(
                                    option ? option.substring(0, option.indexOf("|")) : option,
                                    doNotSetTitleCase
                                  )}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    visibility: "hidden",
                                    color: `${includeHistoric && isHistoric(option) ? adsRed : "textDisabled"}`,
                                  }}
                                  align="left"
                                >
                                  {option ? option.substring(option.indexOf("|") + 1) : option}
                                </Typography>
                              </Fragment>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                                align="left"
                              >
                                {lookupToTitleCase(option, doNotSetTitleCase)}
                              </Typography>
                            )}
                          </Stack>
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={FormSelectInputStyle(hasError.current)}
                        error={hasError.current}
                        fullWidth
                        disabled={!isEditable}
                        required={isRequired}
                        placeholder={displayNoChange ? "No change" : undefined}
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
                    aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
                  />
                </Tooltip>
              ) : allowAddLookup && controlFocused ? (
                <Tooltip
                  title={isRequired ? helperText + " This is a required field." : helperText}
                  arrow
                  placement="right"
                  sx={tooltipStyle}
                >
                  <Autocomplete
                    id={`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`}
                    sx={{
                      color: "inherit",
                    }}
                    getOptionLabel={(option) => lookupToTitleCase(option, doNotSetTitleCase)}
                    noOptionsText={`No ${label === "Street classification" ? "Classification" : label} records`}
                    options={options}
                    value={controlValue}
                    autoHighlight
                    autoSelect
                    onChange={handleChangeEvent}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    renderOption={(props, option) => {
                      return (
                        <li {...props}>
                          <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                            {lookupColour && getItemAvatar(option)}
                            {includeHiddenCode ? (
                              <Fragment>
                                <Typography
                                  variant="body2"
                                  sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                                  align="left"
                                >
                                  {lookupToTitleCase(
                                    option ? option.substring(0, option.indexOf("|")) : option,
                                    doNotSetTitleCase
                                  )}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    visibility: "hidden",
                                    color: `${includeHistoric && isHistoric(option) ? adsRed : "textDisabled"}`,
                                  }}
                                  align="left"
                                >
                                  {option ? option.substring(option.indexOf("|") + 1) : option}
                                </Typography>
                              </Fragment>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                                align="left"
                              >
                                {lookupToTitleCase(option, doNotSetTitleCase)}
                              </Typography>
                            )}
                          </Stack>
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={FormSelectInputStyle(hasError.current)}
                        error={hasError.current}
                        fullWidth
                        disabled={!isEditable}
                        required={isRequired}
                        placeholder={displayNoChange ? "No change" : undefined}
                        variant="outlined"
                        margin="dense"
                        size="small"
                        slotProps={{
                          input: {
                            ...params.InputProps,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  id="btnClear"
                                  onClick={handleAddLookup}
                                  aria-label="add button"
                                  size="small"
                                >
                                  <AddCircleOutlineIcon sx={ActionIconStyle()} />
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                    aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
                  />
                </Tooltip>
              ) : (
                <Tooltip
                  title={isRequired ? helperText + " This is a required field." : helperText}
                  arrow
                  placement="right"
                  sx={tooltipStyle}
                >
                  <Autocomplete
                    id={`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`}
                    sx={{
                      color: "inherit",
                    }}
                    getOptionLabel={(option) => lookupToTitleCase(option, doNotSetTitleCase)}
                    noOptionsText={`No ${label === "Street classification" ? "Classification" : label} records`}
                    options={options}
                    value={controlValue}
                    autoHighlight
                    autoSelect
                    onChange={handleChangeEvent}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    renderOption={(props, option) => {
                      return (
                        <li {...props}>
                          <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                            {lookupColour && getItemAvatar(option)}
                            {includeHiddenCode ? (
                              <Fragment>
                                <Typography
                                  variant="body2"
                                  sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                                  align="left"
                                >
                                  {lookupToTitleCase(
                                    option ? option.substring(0, option.indexOf("|")) : option,
                                    doNotSetTitleCase
                                  )}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    visibility: "hidden",
                                    color: `${includeHistoric && isHistoric(option) ? adsRed : "textDisabled"}`,
                                  }}
                                  align="left"
                                >
                                  {option ? option.substring(option.indexOf("|") + 1) : option}
                                </Typography>
                              </Fragment>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                                align="left"
                              >
                                {lookupToTitleCase(option, doNotSetTitleCase)}
                              </Typography>
                            )}
                          </Stack>
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={FormSelectInputStyle(hasError.current)}
                        error={hasError.current}
                        fullWidth
                        disabled={!isEditable}
                        required={isRequired}
                        placeholder={displayNoChange ? "No change" : undefined}
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
                    aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
                  />
                </Tooltip>
              )
            ) : lookupColour ? (
              isClassification ? (
                <Autocomplete
                  id={`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`}
                  sx={{
                    color: "inherit",
                  }}
                  getOptionLabel={(option) => lookupToTitleCase(option, doNotSetTitleCase)}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  noOptionsText={`No ${label === "Street classification" ? "Classification" : label} records`}
                  options={options}
                  autoHighlight
                  autoSelect
                  value={controlValue}
                  onChange={handleChangeEvent}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  renderOption={(props, option) => {
                    return (
                      <li {...props}>
                        {includeHiddenCode ? (
                          <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                            <Typography
                              variant="body2"
                              sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                              align="left"
                            >
                              {lookupToTitleCase(
                                option ? option.substring(0, option.indexOf("|")) : option,
                                doNotSetTitleCase
                              )}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                visibility: "hidden",
                                color: `${includeHistoric && isHistoric(option) ? adsRed : "textDisabled"}`,
                              }}
                              align="left"
                            >
                              {option ? option.substring(option.indexOf("|") + 1) : option}
                            </Typography>
                          </Stack>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                            align="left"
                          >
                            {lookupToTitleCase(option, doNotSetTitleCase)}
                          </Typography>
                        )}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={FormSelectInputStyle(hasError.current)}
                      error={hasError.current}
                      fullWidth
                      disabled={!isEditable}
                      required={isRequired}
                      placeholder={displayNoChange ? "No change" : undefined}
                      variant="outlined"
                      margin="dense"
                      size="small"
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">{getItemAvatar(controlValue)}</InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                  aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
                />
              ) : allowAddLookup && controlFocused ? (
                <Autocomplete
                  id={`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`}
                  sx={{
                    color: "inherit",
                  }}
                  getOptionLabel={(option) => lookupToTitleCase(option, doNotSetTitleCase)}
                  noOptionsText={`No ${label === "Street classification" ? "Classification" : label} records`}
                  options={options}
                  autoHighlight
                  autoSelect
                  value={controlValue}
                  onChange={handleChangeEvent}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  renderOption={(props, option) => {
                    return (
                      <li {...props}>
                        {includeHiddenCode ? (
                          <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                            <Typography
                              variant="body2"
                              sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                              align="left"
                            >
                              {lookupToTitleCase(
                                option ? option.substring(0, option.indexOf("|")) : option,
                                doNotSetTitleCase
                              )}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                visibility: "hidden",
                                color: `${includeHistoric && isHistoric(option) ? adsRed : "textDisabled"}`,
                              }}
                              align="left"
                            >
                              {option ? option.substring(option.indexOf("|") + 1) : option}
                            </Typography>
                          </Stack>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                            align="left"
                          >
                            {lookupToTitleCase(option, doNotSetTitleCase)}
                          </Typography>
                        )}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={FormSelectInputStyle(hasError.current)}
                      error={hasError.current}
                      fullWidth
                      disabled={!isEditable}
                      required={isRequired}
                      placeholder={displayNoChange ? "No change" : undefined}
                      variant="outlined"
                      margin="dense"
                      size="small"
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">{getItemAvatar(controlValue)}</InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton id="btnClear" onClick={handleAddLookup} aria-label="add button" size="small">
                                <AddCircleOutlineIcon sx={ActionIconStyle()} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                  aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
                />
              ) : (
                <Autocomplete
                  id={`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`}
                  sx={{
                    color: "inherit",
                  }}
                  getOptionLabel={(option) => lookupToTitleCase(option, doNotSetTitleCase)}
                  noOptionsText={`No ${label === "Street classification" ? "Classification" : label} records`}
                  options={options}
                  autoHighlight
                  autoSelect
                  value={controlValue}
                  onChange={handleChangeEvent}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  renderOption={(props, option) => {
                    return (
                      <li {...props}>
                        {includeHiddenCode ? (
                          <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                            <Typography
                              variant="body2"
                              sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                              align="left"
                            >
                              {lookupToTitleCase(
                                option ? option.substring(0, option.indexOf("|")) : option,
                                doNotSetTitleCase
                              )}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                visibility: "hidden",
                                color: `${includeHistoric && isHistoric(option) ? adsRed : "textDisabled"}`,
                              }}
                              align="left"
                            >
                              {option ? option.substring(option.indexOf("|") + 1) : option}
                            </Typography>
                          </Stack>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                            align="left"
                          >
                            {lookupToTitleCase(option, doNotSetTitleCase)}
                          </Typography>
                        )}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={FormSelectInputStyle(hasError.current)}
                      error={hasError.current}
                      fullWidth
                      disabled={!isEditable}
                      required={isRequired}
                      placeholder={displayNoChange ? "No change" : undefined}
                      variant="outlined"
                      margin="dense"
                      size="small"
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">{getItemAvatar(controlValue)}</InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                  aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
                />
              )
            ) : isClassification ? (
              <Autocomplete
                id={`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`}
                sx={{
                  color: "inherit",
                }}
                getOptionLabel={(option) => lookupToTitleCase(option, doNotSetTitleCase)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                noOptionsText={`No ${label === "Street classification" ? "Classification" : label} records`}
                options={options}
                autoHighlight
                autoSelect
                value={controlValue}
                onChange={handleChangeEvent}
                onFocus={handleFocus}
                onBlur={handleBlur}
                renderOption={(props, option) => {
                  return (
                    <li {...props}>
                      {includeHiddenCode ? (
                        <Stack direction="row">
                          <Typography
                            variant="body2"
                            sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                            align="left"
                          >
                            {lookupToTitleCase(
                              option ? option.substring(0, option.indexOf("|")) : option,
                              doNotSetTitleCase
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              visibility: "hidden",
                              color: `${includeHistoric && isHistoric(option) ? adsRed : "textDisabled"}`,
                            }}
                            align="left"
                          >
                            {option ? option.substring(option.indexOf("|") + 1) : option}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                          align="left"
                        >
                          {lookupToTitleCase(option, doNotSetTitleCase)}
                        </Typography>
                      )}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={FormSelectInputStyle(hasError.current)}
                    error={hasError.current}
                    fullWidth
                    disabled={!isEditable}
                    required={isRequired}
                    placeholder={displayNoChange ? "No change" : undefined}
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
                aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
              />
            ) : allowAddLookup && controlFocused ? (
              <Autocomplete
                id={`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`}
                sx={{
                  color: "inherit",
                }}
                getOptionLabel={(option) => lookupToTitleCase(option, doNotSetTitleCase)}
                noOptionsText={`No ${label === "Street classification" ? "Classification" : label} records`}
                options={options}
                autoHighlight
                autoSelect
                value={controlValue}
                onChange={handleChangeEvent}
                onFocus={handleFocus}
                onBlur={handleBlur}
                renderOption={(props, option) => {
                  return (
                    <li {...props}>
                      {includeHiddenCode ? (
                        <Stack direction="row">
                          <Typography
                            variant="body2"
                            sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                            align="left"
                          >
                            {lookupToTitleCase(
                              option ? option.substring(0, option.indexOf("|")) : option,
                              doNotSetTitleCase
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              visibility: "hidden",
                              color: `${includeHistoric && isHistoric(option) ? adsRed : "textDisabled"}`,
                            }}
                            align="left"
                          >
                            {option ? option.substring(option.indexOf("|") + 1) : option}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                          align="left"
                        >
                          {lookupToTitleCase(option, doNotSetTitleCase)}
                        </Typography>
                      )}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={FormSelectInputStyle(hasError.current)}
                    error={hasError.current}
                    fullWidth
                    disabled={!isEditable}
                    required={isRequired}
                    placeholder={displayNoChange ? "No change" : undefined}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton id="btnClear" onClick={handleAddLookup} aria-label="add button" size="small">
                              <AddCircleOutlineIcon sx={ActionIconStyle()} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
                aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
              />
            ) : (
              <Autocomplete
                id={`ads-select-${label.toLowerCase().replaceAll(" ", "-")}`}
                sx={{
                  color: "inherit",
                }}
                getOptionLabel={(option) => lookupToTitleCase(option, doNotSetTitleCase)}
                noOptionsText={`No ${label === "Street classification" ? "Classification" : label} records`}
                options={options}
                autoHighlight
                autoSelect
                value={controlValue}
                onChange={handleChangeEvent}
                onFocus={handleFocus}
                onBlur={handleBlur}
                renderOption={(props, option) => {
                  return (
                    <li {...props}>
                      {includeHiddenCode ? (
                        <Stack direction="row">
                          <Typography
                            variant="body2"
                            sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                            align="left"
                          >
                            {lookupToTitleCase(
                              option ? option.substring(0, option.indexOf("|")) : option,
                              doNotSetTitleCase
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              visibility: "hidden",
                              color: `${includeHistoric && isHistoric(option) ? adsRed : "textDisabled"}`,
                            }}
                            align="left"
                          >
                            {option ? option.substring(option.indexOf("|") + 1) : option}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: `${includeHistoric && isHistoric(option) ? adsRed : adsDarkGrey}` }}
                          align="left"
                        >
                          {lookupToTitleCase(option, doNotSetTitleCase)}
                        </Typography>
                      )}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={FormSelectInputStyle(hasError.current)}
                    error={hasError.current}
                    fullWidth
                    disabled={!isEditable}
                    required={isRequired}
                    placeholder={displayNoChange ? "No change" : undefined}
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
                aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
              />
            )
          ) : (
            getLookupInfo(value)
          )}
        </Grid2>
        {displayError && (
          <ADSErrorDisplay errorText={displayError} id={`${label.toLowerCase().replaceAll(" ", "-")}-select-error`} />
        )}
      </Grid2>
    </Box>
  );
};

export default ADSSelectControl;
