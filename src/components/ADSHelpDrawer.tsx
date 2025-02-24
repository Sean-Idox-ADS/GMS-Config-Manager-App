//#region header */
/**************************************************************************************************
//
//  Description: Help drawer
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

import React, { ReactElement } from "react";

import { Box, Drawer, DrawerProps, Grid2, IconButton, Link, Stack, Typography } from "@mui/material";

import EmailIcon from "@mui/icons-material/EmailOutlined";
import CallIcon from "@mui/icons-material/CallOutlined";

import { useTheme } from "@mui/material/styles";
import {
  drawerWidth,
  ActionIconStyle,
  drawerTitleStyle,
  drawerSubTitleStyle,
  drawerTextStyle,
  drawerLinkStyle,
} from "../utils/ADSStyles";
import ADSActionButton, { ADSActionButtonVariant } from "./ADSActionButton";
import { adsMidGreyA, adsOffWhite } from "../utils/ADSColour";
import { appTitle, guiVersion } from "../utils/HelperUtils";
import { CopyIcon } from "../utils/ADSIcons";

interface ADSHelpDrawerProps extends DrawerProps {
  open: boolean;
  handleDrawerClose: () => void;
}

const ADSHelpDrawer: React.FC<ADSHelpDrawerProps> = ({ open, handleDrawerClose }) => {
  const theme = useTheme();

  const SubTitle = (title: string): ReactElement => (
    <Typography align="left" variant="subtitle1" sx={drawerSubTitleStyle}>
      {title}
    </Typography>
  );

  const BodyText = (text: string): ReactElement => (
    <Typography align="left" variant="subtitle2" sx={drawerTextStyle}>
      {text}
    </Typography>
  );

  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const copyMetadataInfo = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    event.stopPropagation();

    let copyString = `${appTitle} API Metadata Information\n`;
    copyString += `===========================================\n`;
    copyString += `\n`;
    copyString += `URL: ${process.env.REACT_APP_SECURITY_API}\n`;
    copyString += `Version: ${process.env.REACT_APP_SECURITY_VERSION}`;

    copyTextToClipboard(copyString);
  };

  return (
    <Drawer
      sx={{
        width: `${drawerWidth}px`,
        anchor: "right",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: `${drawerWidth}px`,
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <Box
        sx={{
          pt: 1.5,
          alignItems: "center",
          ...theme.mixins.toolbar,
          justifyContent: "flex-start",
        }}
      >
        <Grid2 container direction="row" justifyContent="space-between" alignItems="center">
          <Grid2 size={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mr: 2 }}>
              <Typography variant="h6" noWrap sx={drawerTitleStyle}>
                Help and support
              </Typography>
              <ADSActionButton
                variant={ADSActionButtonVariant.close}
                tooltipTitle="Close help"
                tooltipPlacement="left"
                onClick={handleDrawerClose}
              />
            </Stack>
          </Grid2>
        </Grid2>
      </Box>
      <Box sx={{ overflowY: "auto", backgroundColor: adsOffWhite }}>
        <Grid2
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          rowSpacing={1}
          sx={{ pl: "24px" }}
        >
          <Grid2 size={12} sx={{ pt: "24px" }}>
            {SubTitle("GMS Configuration Manager")}
          </Grid2>
          <Grid2 size={12} sx={{ paddingTop: theme.spacing(1), marginRight: theme.spacing(3) }}>
            {BodyText(`Version: ${guiVersion}`)}
          </Grid2>
          <Grid2 size={12} sx={{ paddingTop: theme.spacing(3) }}>
            {SubTitle("General Enquiries")}
          </Grid2>
          <Grid2>
            <Stack direction="row" spacing={1} alignItems={"center"} justifyContent={"flex-start"}>
              <EmailIcon sx={{ color: adsMidGreyA, display: "inline-flex" }} />
              <Link
                align={"left"}
                href="mailto:ads_solutions@idoxgroup.com?subject=Solutions enquiry raised from GMS Configuration Manager"
                variant="body2"
              >
                ads_solutions@idoxgroup.com
              </Link>
            </Stack>
          </Grid2>
          <Grid2>
            <Stack direction="row" spacing={1} alignItems={"center"} justifyContent={"flex-start"}>
              <CallIcon sx={{ color: adsMidGreyA, display: "inline-flex" }} />
              {BodyText("+44 (0) 1483 717 950")}
            </Stack>
          </Grid2>
          <Grid2 size={12} sx={{ pt: theme.spacing(1) }}>
            {BodyText("Idox Software Ltd")}
            {BodyText("Unit 5 Woking 8")}
            {BodyText("Forsyth Road")}
            {BodyText("Woking")}
            {BodyText("Surrey")}
            {BodyText("GU21 5SB")}
          </Grid2>
          <Grid2 size={12} sx={{ paddingTop: theme.spacing(2) }}>
            {SubTitle("API Metadata information")}
          </Grid2>
          <Grid2 container direction="row" justifyContent="flex-start" alignItems="center">
            <Grid2 size={12}>
              {BodyText(`URL: ${process.env.REACT_APP_SECURITY_API || ""}`)}
              {BodyText(`Version: ${process.env.REACT_APP_SECURITY_VERSION || ""}`)}
            </Grid2>

            <Grid2>
              <Stack direction="row" spacing={1} alignItems={"center"} justifyContent={"flex-start"}>
                <IconButton onClick={(event) => copyMetadataInfo(event)} size="small" sx={{ color: adsMidGreyA }}>
                  <CopyIcon sx={ActionIconStyle()} />
                </IconButton>
                <Link
                  component="button"
                  align={"left"}
                  variant="body2"
                  onClick={(event) => copyMetadataInfo(event)}
                  sx={drawerLinkStyle}
                >
                  Copy metadata information
                </Link>
              </Stack>
            </Grid2>
          </Grid2>
        </Grid2>
      </Box>
    </Drawer>
  );
};

export default ADSHelpDrawer;
