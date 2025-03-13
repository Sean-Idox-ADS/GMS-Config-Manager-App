//#region header */
/**************************************************************************************************
//
//  Description: Login dialog
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
//    002   12.03.25 Sean Flook          GMSCM-1 Set the isAdministrator & isSuperAdministrator property for the user.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

import React, { useContext, useEffect, useState } from "react";

import UserContext from "../context/UserContext";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import LoginIcon from "@mui/icons-material/Login";
import LockResetIcon from "@mui/icons-material/LockReset";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";

import { adsBlueA, adsWhite } from "../utils/ADSColour";
import { blueButtonStyle, whiteButtonStyle } from "../utils/ADSStyles";
import { useTheme } from "@mui/material/styles";
import ADSTextControl from "../components/ADSTextControl";
import {
  AuthoriseUser,
  LoginUser,
  ResendEmail,
  ResetMyPassword,
  SendPasswordResetCode,
  UpdateMyPassword,
  ValidatePassword,
  WhoAmI,
} from "../configuration/ADSConfiguration";
import AuthenticateDto from "../dtos/authenticateDto";
import WhoAmIDto from "../dtos/whoAmIDto";
import CurrentUserType from "../models/currentUserType";

interface LoginDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  changePassword?: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, title, message, changePassword = false, onClose }) => {
  const theme = useTheme();

  const userContext = useContext(UserContext);

  const [step, setStep] = useState<number>(0);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authoriseId, setAuthoriseId] = useState<string>("");
  const [authenticationCode, setAuthenticationCode] = useState<string>("");
  const [resetId, setResetId] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [retypePassword, setRetypePassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string[]>([]);
  const [authenticationError, setAuthenticationError] = useState<string[]>([]);
  const [newPasswordError, setNewPasswordError] = useState<string[]>([]);
  const [retypePasswordError, setRetypePasswordError] = useState<string[]>([]);

  /**
   * Event to handle when the dialog closes.
   */
  const handleDialogClose = () => {
    if (onClose) onClose();
  };

  /**
   * Event to handle changing the username.
   *
   * @param newValue The new username.
   */
  const handleUsernameChangeEvent = (newValue: string) => {
    setUsername(newValue);
  };

  /**
   * Event to handle changing the password.
   *
   * @param newValue The new password.
   */
  const handlePasswordChangeEvent = (newValue: string) => {
    setPassword(newValue);
  };

  /**
   * Event to handle changing the authentication code.
   *
   * @param newValue The new authentication code.
   */
  const handleAuthenticationCodeChangeEvent = (newValue: string) => {
    setAuthenticationCode(newValue);
  };

  /**
   * Event to handle changing the new password.
   *
   * @param newValue The new password.
   */
  const handleNewPasswordChangeEvent = (newValue: string) => {
    setNewPassword(newValue);
  };

  /**
   * Event to handle changing the retyped password.
   *
   * @param newValue The new retyped password.
   */
  const handleRetypePasswordChangeEvent = (newValue: string) => {
    setRetypePassword(newValue);
  };

  /**
   * Method to handle when the login button is clicked.
   */
  const handleLoginClick = async () => {
    setLoginError([]);

    const loginRes: string | undefined = await LoginUser(username, password, setLoginError);

    if (!loginRes) {
      setUsername("");
      setPassword("");
    } else {
      userContext.updateAuthenticateId(loginRes);
      setAuthoriseId(loginRes);
      setStep(1);
    }
  };

  /**
   * Method to handle when user has forgotten their password
   */
  const handleForgotPasswordClick = async () => {
    if (!username) {
      setLoginError(["Enter the username you want to reset the password for."]);
    } else {
      const newResetId: string | void = await SendPasswordResetCode(username, setRetypePasswordError);
      if (newResetId) {
        setResetId(newResetId);
        setStep(2);
      }
    }
  };

  /**
   * Method to handle authenticating the user
   */
  const handleAuthenticateClick = async () => {
    setAuthenticationError([]);

    if (!authenticationCode) {
      setAuthenticationError(["Enter your authentication code and try again."]);
    } else {
      const authorisationRes: AuthenticateDto | undefined = await AuthoriseUser(
        authoriseId,
        authenticationCode,
        setAuthenticationError
      );

      if (!authorisationRes) {
        setAuthoriseId("");
      } else {
        if (!authorisationRes.token) {
          setAuthenticationError(["No user token was returned."]);
        } else {
          userContext.updateLoginDetails(authorisationRes);

          const whoAmIRes: WhoAmIDto | undefined = await WhoAmI(authorisationRes.token, setAuthenticationError);
          if (whoAmIRes) {
            if (whoAmIRes.active && !whoAmIRes.isDeleted) {
              const newCurrentUser: CurrentUserType = {
                ...whoAmIRes,
                displayName: `${whoAmIRes.firstName} ${whoAmIRes.lastName}`,
                isAdministrator: whoAmIRes.rights.includes("Administrator"),
                isSuperAdministrator: whoAmIRes.rights.includes("SuperAdministrator"),
              };
              userContext.updateCurrentUser(newCurrentUser);
            } else {
              userContext.updateCurrentUser(undefined);
              if (!whoAmIRes.active) setLoginError(["You are not an active user on this system."]);
              else setLoginError(["This user has been deleted."]);
              setUsername("");
              setPassword("");
              setStep(0);
            }
          } else {
            setAuthenticationError(["Unable to get user information"]);
          }
        }
      }
    }
  };

  /**
   * Method to handle resending the authentication email
   */
  const handleResendEmailClick = () => {
    setAuthenticationError([]);
    if (!authoriseId) {
      ResendEmail(authoriseId, setAuthenticationError);
    } else {
      setAuthenticationError(["No authorisation id available."]);
    }
  };

  /**
   * Method to handle when user resets their password
   */
  const handleResetPasswordClick = async () => {
    setNewPasswordError([]);
    setRetypePasswordError([]);
    setAuthenticationError([]);

    if (!newPassword) {
      setNewPasswordError(["Enter a new password and try again."]);
    } else if (!retypePassword) {
      setRetypePasswordError(["Retype your new password and try again."]);
    } else if (newPassword !== retypePassword) {
      setNewPasswordError(["The passwords do not match, try again."]);
    } else if (!authenticationCode) {
      setAuthenticationError(["Enter the code that was emailed to you."]);
    } else {
      const passwordValid: boolean | void = await ValidatePassword(newPassword, setNewPasswordError);

      if (passwordValid) {
        const passwordReset: boolean | void = await ResetMyPassword(
          resetId,
          authenticationCode,
          newPassword,
          retypePassword,
          setNewPasswordError
        );

        if (passwordReset) {
          setAuthenticationCode("");
          setStep(0);
        }
      }
    }
  };

  /**
   * Method to handle when user changes their password
   */
  const handleChangePasswordClick = async () => {
    setNewPasswordError([]);
    setRetypePasswordError([]);

    if (!newPassword) {
      setNewPasswordError(["Enter a new password and try again."]);
    } else if (!retypePassword) {
      setRetypePasswordError(["Retype your new password and try again."]);
    } else if (newPassword !== retypePassword) {
      setNewPasswordError(["The passwords do not match, try again."]);
    } else {
      const passwordValid: boolean | void = await ValidatePassword(newPassword, setNewPasswordError);

      if (passwordValid) {
        const passwordUpdated: boolean | void = await UpdateMyPassword(newPassword, setNewPasswordError);

        if (passwordUpdated) setShowDialog(false);
      }
    }
  };

  /**
   * Method to handle when user cancels resetting their password
   */
  const handleCancelClick = () => {
    if (changePassword && onClose) onClose();
    setStep(0);
  };

  /**
   * Method to get the title for the dialog.
   *
   * @returns {string} The title for the dialog.
   */
  const getTitle = (): string => {
    switch (step) {
      case 1:
        return `${!!title ? title : "Login"} Authentication`;

      case 2:
        return "Reset Password";

      case 3:
        return "Change Password";

      default:
        return `${!!title ? title : "Login"}`;
    }
  };

  /**
   * Method to get the controls for the content section of the dialog.
   *
   * @returns {JSX.Element} The controls that need to be displayed in the content section of the dialog.
   */
  function getContent(): React.ReactNode {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="body1">{message}</Typography>
            {loginError && (
              <Typography variant="body1" color="error">
                {loginError}
              </Typography>
            )}
            <ADSTextControl
              label="Username"
              isEditable
              isRequired
              value={username}
              id="username"
              maxLength={30}
              onChange={handleUsernameChangeEvent}
            />
            <ADSTextControl
              label="Password"
              isEditable
              isRequired
              isHidden={true}
              value={password}
              id="password"
              maxLength={20}
              onChange={handlePasswordChangeEvent}
            />
          </>
        );

      case 1:
        return (
          <>
            <Typography variant="body1">Enter authentication code</Typography>
            <ADSTextControl
              label="Code"
              isEditable
              isRequired
              value={authenticationCode}
              errorText={authenticationError}
              id="authentication-code"
              maxLength={10}
              onChange={handleAuthenticationCodeChangeEvent}
            />
            {loginError && (
              <Typography variant="body1" color="error">
                {loginError}
              </Typography>
            )}
          </>
        );

      case 2:
        return (
          <>
            <Typography variant="body2">Passwords must be:</Typography>
            <List dense>
              <ListItem key="passwordInfo1">
                <ListItemIcon>
                  <CircleIcon sx={{ width: "12px", height: "12px" }} />
                </ListItemIcon>
                <ListItemText primary="between 5 and 20 characters long." />
              </ListItem>
              <ListItem key="passwordInfo2">
                <ListItemIcon>
                  <CircleIcon sx={{ width: "12px", height: "12px" }} />
                </ListItemIcon>
                <ListItemText primary="have at least 4 unique characters." />
              </ListItem>
              <ListItem key="passwordInfo3">
                <ListItemIcon>
                  <CircleIcon sx={{ width: "12px", height: "12px" }} />
                </ListItemIcon>
                <ListItemText primary="have uppercase and lowercase characters." />
              </ListItem>
              <ListItem key="passwordInfo4">
                <ListItemIcon>
                  <CircleIcon sx={{ width: "12px", height: "12px" }} />
                </ListItemIcon>
                <ListItemText primary="have numbers." />
              </ListItem>
              <ListItem key="passwordInfo5">
                <ListItemIcon>
                  <CircleIcon sx={{ width: "12px", height: "12px" }} />
                </ListItemIcon>
                <ListItemText primary="have special characters." />
              </ListItem>
            </List>
            <ADSTextControl
              label="New password"
              isEditable
              isRequired
              isHidden
              value={newPassword}
              errorText={newPasswordError}
              id="new-password"
              maxLength={20}
              onChange={handleNewPasswordChangeEvent}
            />
            <ADSTextControl
              label="Retype password"
              isEditable
              isRequired
              isHidden
              value={retypePassword}
              errorText={retypePasswordError}
              id="retype-password"
              maxLength={20}
              onChange={handleRetypePasswordChangeEvent}
            />
            <ADSTextControl
              label="Code"
              isEditable
              isRequired
              value={authenticationCode}
              errorText={authenticationError}
              id="authentication-code"
              maxLength={10}
              onChange={handleAuthenticationCodeChangeEvent}
            />
          </>
        );

      case 3:
        return (
          <>
            <Typography variant="body2">Passwords must be:</Typography>
            <List dense>
              <ListItem key="passwordInfo1">
                <ListItemIcon>
                  <CircleIcon sx={{ width: "12px", height: "12px" }} />
                </ListItemIcon>
                <ListItemText primary="between 5 and 20 characters long." />
              </ListItem>
              <ListItem key="passwordInfo2">
                <ListItemIcon>
                  <CircleIcon sx={{ width: "12px", height: "12px" }} />
                </ListItemIcon>
                <ListItemText primary="have at least 4 unique characters." />
              </ListItem>
              <ListItem key="passwordInfo3">
                <ListItemIcon>
                  <CircleIcon sx={{ width: "12px", height: "12px" }} />
                </ListItemIcon>
                <ListItemText primary="have uppercase and lowercase characters." />
              </ListItem>
              <ListItem key="passwordInfo4">
                <ListItemIcon>
                  <CircleIcon sx={{ width: "12px", height: "12px" }} />
                </ListItemIcon>
                <ListItemText primary="have numbers." />
              </ListItem>
              <ListItem key="passwordInfo5">
                <ListItemIcon>
                  <CircleIcon sx={{ width: "12px", height: "12px" }} />
                </ListItemIcon>
                <ListItemText primary="have special characters." />
              </ListItem>
            </List>
            <ADSTextControl
              label="New password"
              isEditable
              isRequired
              isHidden
              value={newPassword}
              errorText={newPasswordError}
              id="new-password"
              maxLength={20}
              onChange={handleNewPasswordChangeEvent}
            />
            <ADSTextControl
              label="Retype password"
              isEditable
              isRequired
              isHidden
              value={retypePassword}
              errorText={retypePasswordError}
              id="retype-password"
              maxLength={20}
              onChange={handleRetypePasswordChangeEvent}
            />{" "}
          </>
        );

      default:
        return null;
    }
  }

  /**
   * Method to get the controls for the actions section of the dialog.
   *
   * @returns The controls that need to be displayed in the action section of the dialog.
   */
  const getActions = (): React.ReactNode => {
    switch (step) {
      case 0:
        return (
          <>
            <Button
              onClick={handleLoginClick}
              autoFocus
              variant="contained"
              sx={blueButtonStyle}
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
            <Button onClick={handleForgotPasswordClick} variant="contained" sx={whiteButtonStyle}>
              Forgot password
            </Button>
          </>
        );

      case 1:
        return (
          <>
            <Button
              onClick={handleAuthenticateClick}
              autoFocus
              variant="contained"
              sx={blueButtonStyle}
              startIcon={<LoginIcon />}
            >
              Authenticate
            </Button>
            <Button onClick={handleResendEmailClick} variant="contained" sx={whiteButtonStyle}>
              Resend email
            </Button>
          </>
        );

      case 2:
        return (
          <>
            <Button
              onClick={handleResetPasswordClick}
              autoFocus
              variant="contained"
              sx={blueButtonStyle}
              startIcon={<LockResetIcon />}
            >
              Reset password
            </Button>
            <Button onClick={handleCancelClick} variant="contained" sx={whiteButtonStyle} startIcon={<CloseIcon />}>
              Cancel
            </Button>
          </>
        );

      case 3:
        return (
          <>
            <Button
              onClick={handleChangePasswordClick}
              autoFocus
              variant="contained"
              sx={blueButtonStyle}
              startIcon={<LockResetIcon />}
            >
              Change password
            </Button>
            <Button onClick={handleCancelClick} variant="contained" sx={whiteButtonStyle} startIcon={<CloseIcon />}>
              Cancel
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    setShowDialog(isOpen);
    if (changePassword) {
      setStep(3);
    } else {
      setStep(0);
      setAuthenticationCode("");
    }
  }, [isOpen, changePassword]);

  return (
    <Dialog open={showDialog} aria-labelledby="user-login-dialog" fullWidth maxWidth="xs" onClose={handleDialogClose}>
      <DialogTitle id="user-login-dialog" sx={{ color: adsWhite, backgroundColor: adsBlueA }}>
        {getTitle()}
      </DialogTitle>
      <DialogContent sx={{ mt: theme.spacing(1) }}>{getContent()}</DialogContent>
      <DialogActions sx={{ justifyContent: "flex-start", mb: theme.spacing(1), pl: theme.spacing(3) }}>
        {getActions()}
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
