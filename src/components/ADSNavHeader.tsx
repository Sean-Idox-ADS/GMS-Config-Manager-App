//#region header */
/**************************************************************************************************
//
//  Description: Navigation Header
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

import { appTitle } from "../utils/HelperUtils";

import { Grid2, Typography } from "@mui/material";

const ADSNavHeader = () => {
  return (
    <Grid2 container spacing={0} alignItems={"center"} alignContent={"left"} sx={{ border: 0, width: "100%" }}>
      <Grid2 sx={{ ml: 8, mt: 2 }}>
        <Typography>{`${appTitle}`}</Typography>
      </Grid2>
    </Grid2>
  );
};

export default ADSNavHeader;
