//#region header */
/**************************************************************************************************
//
//  Description: User avatar
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
//    002   12.03.25 Sean Flook          GMSCM-1 Code required for managing the configuration and cluster documents.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

import React, { Fragment, ReactElement, useContext, useEffect, useState } from "react";

import UserContext from "../context/UserContext";
import ConfigContext from "../context/ConfigContext";
import ClusterContext from "../context/ClusterContext";

import { GetUserName, StringToColour } from "../utils/HelperUtils";

import { Avatar, Card, CardActions, CardContent, IconButton, Popover, Stack, Tooltip, Typography } from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { ActionIconStyle, tooltipStyle } from "../utils/ADSStyles";

import LogoutIcon from "@mui/icons-material/Logout";
import PasswordIcon from "@mui/icons-material/Password";

import { useTheme } from "@mui/material/styles";
import LoginDialog from "../dialogs/LoginDialog";

interface ADSUserAvatarProps {
  onSaveChanges: (type: string) => void;
}

const ADSUserAvatar: React.FC<ADSUserAvatarProps> = ({ onSaveChanges }) => {
  const theme = useTheme();

  const userContext = useContext(UserContext);
  const configContext = useContext(ConfigContext);
  const clusterContext = useContext(ClusterContext);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const settingsOpen = Boolean(anchorEl);
  const settingsPopoverId = settingsOpen ? "ads-settings-popover" : undefined;

  const [loginOpen, setLoginOpen] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  function GetUserIcon(): ReactElement {
    if (!userContext.currentUser || !userContext.currentUser.active) {
      return (
        <IconButton
          id="gms-configuration-manager-user-settings"
          aria-label="profile"
          onClick={handleAvatarClick}
          size="large"
        >
          <Tooltip title="Login" arrow placement="right" sx={tooltipStyle}>
            <AccountCircleIcon fontSize="large" sx={ActionIconStyle()} />
          </Tooltip>
        </IconButton>
      );
    } else {
      let userInitials = "?";
      const user = GetUserName(userContext.currentUser.displayName);

      if (user) {
        if (user.includes(" ")) {
          const userArray = user.split(" ");

          userInitials =
            userArray[0].substring(0, 1).toUpperCase() + userArray[userArray.length - 1].substring(0, 1).toUpperCase();
        } else userInitials = user.substring(0, 1).toUpperCase();
      }

      return (
        <Tooltip
          title={
            <Fragment>
              <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                {userContext.currentUser.displayName}
              </Typography>
              <br />
              <Typography variant="caption">Settings & Admin</Typography>
            </Fragment>
          }
          arrow
          placement="right"
          sx={tooltipStyle}
        >
          <Avatar
            id="gms-configuration-manager-user-settings"
            sx={{
              backgroundColor: StringToColour(user),
              height: 30,
              width: 30,
              cursor: "pointer",
            }}
            children={
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "16px" }}>
                {userInitials}
              </Typography>
            }
            onClick={handleAvatarClick}
          />
        </Tooltip>
      );
    }
  }

  /**
   * Method to display the options to log off and change password for the user.
   */
  const handleAvatarClick = () => {
    if (userContext.currentUser) {
      if (configContext.documentChanged) {
        onSaveChanges("user_configuration");
      } else if (clusterContext.clusterChanged) {
        onSaveChanges("user_cluster");
      } else {
        setAnchorEl(document.getElementById("gms-configuration-manager-user-settings") as HTMLButtonElement);
      }
    }
  };

  /**
   * Method to display the change password dialog.
   */
  const handleChangePasswordClick = () => {
    setAnchorEl(null);
    setChangePassword(true);
    setLoginOpen(true);
  };

  /**
   * Event to handle when the login dialog closes.
   */
  const handleLoginDialogClose = () => {
    setChangePassword(false);
    setLoginOpen(false);
  };

  const GetSettingCards = () => (
    <Stack direction="row" spacing={0.5}>
      {userContext.currentUser && (
        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              {userContext.currentUser && (
                <Typography sx={{ fontWeight: "bold" }}>
                  {`${userContext.currentUser.firstName} ${userContext.currentUser.lastName}`}
                </Typography>
              )}
            </Stack>
          </CardContent>
          <CardActions>
            <Stack
              sx={{ ml: theme.spacing(2), mr: theme.spacing(2), mb: theme.spacing(2) }}
              direction="column"
              spacing={1}
              alignItems="flex-start"
            >
              <IconButton
                id={`ads-action-button-${"Log Out".toLowerCase().replace(/ /g, "-")}`}
                size="small"
                disabled={false}
                onClick={() => {
                  userContext.logoff(true);
                }}
              >
                <LogoutIcon sx={ActionIconStyle()} />
                <Typography
                  variant="body2"
                  sx={{
                    pl: theme.spacing(0.5),
                    pr: theme.spacing(1),
                  }}
                >
                  Log Out
                </Typography>
              </IconButton>

              <IconButton
                id={`ads-action-button-${"Change Password".toLowerCase().replace(/ /g, "-")}`}
                size="small"
                disabled={false}
                onClick={handleChangePasswordClick}
              >
                <PasswordIcon sx={ActionIconStyle()} />
                <Typography
                  variant="body2"
                  sx={{
                    pl: theme.spacing(0.5),
                    pr: theme.spacing(1),
                  }}
                >
                  Change Password
                </Typography>
              </IconButton>
            </Stack>
          </CardActions>
        </Card>
      )}
    </Stack>
  );

  useEffect(() => {
    if (userContext.displayDialog) {
      setAnchorEl(document.getElementById("gms-configuration-manager-user-settings") as HTMLButtonElement);
      userContext.onDisplayDialog(false);
    }
  }, [userContext]);

  return (
    <>
      {GetUserIcon()}
      <Popover
        id={settingsPopoverId}
        open={settingsOpen}
        anchorEl={anchorEl}
        onClose={handleSettingsClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {GetSettingCards()}
      </Popover>

      <LoginDialog
        isOpen={loginOpen}
        title="Change Password"
        message=""
        changePassword={changePassword}
        onClose={handleLoginDialogClose}
      />
    </>
  );
};

export default ADSUserAvatar;
