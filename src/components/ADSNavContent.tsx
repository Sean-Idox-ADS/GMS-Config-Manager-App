//#region header */
/**************************************************************************************************
//
//  Description: Navigation Bar contents
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

import React from "react";

import { Drawer, Grid2 } from "@mui/material";
import ADSUserAvatar from "./ADSUserAvatar";

import { useTheme } from "@mui/material/styles";
import { adsLightGreyA50, adsLightGreyB } from "../utils/ADSColour";
import { dataFormStyle } from "../utils/ADSStyles";

interface ADSNavContentProps {}

const ADSNavContent: React.FC<ADSNavContentProps> = () => {
  const theme = useTheme();
  const navBarWidth: string = "60px";

  return (
    <Drawer
      variant="permanent"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        width: `${navBarWidth}px`,
        borderRight: "1px",
        borderRightColor: adsLightGreyB,
        boxShadow: `4px 0px 9px ${adsLightGreyA50}`,
      }}
    >
      <Grid2
        sx={dataFormStyle("ADSNavContent")}
        container
        direction="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid2 sx={{ mt: theme.spacing(1.3) }} size="grow">
          <img src="/images/Idox_Logo.svg" alt="IDOX Group" width="36" />
        </Grid2>
        <Grid2>
          <ADSUserAvatar />
        </Grid2>
      </Grid2>
    </Drawer>
  );
};

export default ADSNavContent;
