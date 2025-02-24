//#region header */
/**************************************************************************************************
//
//  Description: Application Bar
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

import React, { useState } from "react";

import { AppBar, Stack, Tooltip, IconButton } from "@mui/material";
import ADSNavHeader from "./ADSNavHeader";
import ADSHelpDrawer from "./ADSHelpDrawer";

import HelpIcon from "@mui/icons-material/HelpOutline";

import { ActionIconStyle, appBarHeight, drawerWidth } from "../utils/ADSStyles";
import { adsBlueA } from "../utils/ADSColour";
import { useTheme } from "@mui/material/styles";

interface ADSAppBarProps {}

const ADSAppBar: React.FC<ADSAppBarProps> = () => {
  const theme = useTheme();

  const [openHelp, setOpenHelp] = useState<boolean>(false);
  const navBarWidth = 0;

  const handleHelpClick = () => {
    setOpenHelp(!openHelp);
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      id="gms-config-manager-app-bar"
      elevation={0}
      sx={{
        width: "100%",
        zIndex: theme.zIndex.drawer + 1,
        marginLeft: navBarWidth,
        transition: theme.transitions.create(["margin", "width"], {
          easing: openHelp ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp,
          duration: openHelp ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
        }),
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: adsBlueA,
      }}
    >
      <AppBar
        position="fixed"
        color="inherit"
        id="gms-config-manager-app-bar"
        elevation={0}
        sx={{
          width: `calc(100% - ${openHelp ? navBarWidth + drawerWidth : navBarWidth}px)`,
          height: `${appBarHeight}px`,
          ml: `${navBarWidth}px`,
          mr: `${openHelp ? drawerWidth : 0}px`,
          transition: `theme.transitions.create(["margin", "width"], {
          easing: ${openHelp ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp},
          duration: ${openHelp ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen},
        })`,
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: adsBlueA,
        }}
      >
        <Stack
          direction="row"
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{ border: 0, ml: 0.5, mt: 0, pb: 0 }}
        >
          <ADSNavHeader />
          <Tooltip title="Help & support" arrow placement="bottom-end">
            <IconButton aria-label="help and support" onClick={handleHelpClick} size="large" sx={{ mt: 0.75, mr: 0.5 }}>
              <HelpIcon sx={ActionIconStyle()} />
            </IconButton>
          </Tooltip>
        </Stack>
        <ADSHelpDrawer open={openHelp} handleDrawerClose={handleHelpClick} />
      </AppBar>
    </AppBar>
  );
};

export default ADSAppBar;
