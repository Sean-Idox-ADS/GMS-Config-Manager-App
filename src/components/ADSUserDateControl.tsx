//#region header */
/**************************************************************************************************
//
//  Description: Read only user date control
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

import React from "react";
import { FormatDate } from "../utils/HelperUtils";
import { Box, Grid2, Skeleton, Typography } from "@mui/material";
import { boldControlLabelStyle, controlLabelStyle, FormBoxReadOnlyRowStyle, FormRowStyle } from "../utils/ADSStyles";
import { useTheme } from "@mui/material/styles";

interface ADSUserDateControlProps {
  label: string;
  user: string | undefined;
  date: string | undefined;
  loading?: boolean;
  noLeftPadding?: boolean;
  boldLabel?: boolean;
}

const ADSUserDateControl: React.FC<ADSUserDateControlProps> = ({
  label,
  user,
  date,
  loading = false,
  noLeftPadding = false,
  boldLabel = false,
}) => {
  const theme = useTheme();

  /**
   * Method to get the styling for the control.
   *
   * @returns {object | null} The styling to use on the control.
   */
  const getValueStyle = (): object | null => {
    if (noLeftPadding) return null;
    else
      return {
        pl: theme.spacing(2),
      };
  };

  return (
    <Box sx={FormBoxReadOnlyRowStyle(false)}>
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
        <Grid2 size={9}>
          <Typography
            id={`${label.toLowerCase().replaceAll(" ", "-")}-user-date`}
            variant="body1"
            align="left"
            color="textPrimary"
            sx={getValueStyle()}
            aria-labelledby={`${label.toLowerCase().replaceAll(" ", "-")}-label`}
          >
            {loading ? (
              <Skeleton animation="wave" />
            ) : (
              `${user} ${FormatDate(date).includes("am") || FormatDate(date).includes("pm") ? "at" : "on"} ${FormatDate(
                date
              )}`
            )}
          </Typography>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ADSUserDateControl;
