// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Main application file
//
//  Copyright:    © 2025 Idox Software Limited.
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
// region Version 1.0.0.0
//    001   20.02.25 Sean Flook          GMSCM-1 Initial Revision.
//    002   12.03.25 Sean Flook          GMSCM-1 Code required for managing the configuration and cluster documents.
// endregion Version 1.0.0.0
//
//--------------------------------------------------------------------------------------------------
// endregion header

import { Fragment, useRef, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import UserContext from "./context/UserContext";
import { ConfigContextProvider } from "./context/ConfigContext";
import { ClusterContextProvider } from "./context/ClusterContext";

import AuthenticateDto from "./dtos/authenticateDto";
import CurrentUserType from "./models/currentUserType";

import { appTitle, loginStorageName, tokenStorageName, userStorageName } from "./utils/HelperUtils";

import { Offline, Online } from "react-detect-offline";

import WifiOffIcon from "@mui/icons-material/WifiOff";

import { Box, Stack, Typography } from "@mui/material";
import ADSAppBar from "./components/ADSAppBar";
import LoginDialog from "./dialogs/LoginDialog";
import ADSNavContent from "./components/ADSNavContent";
import PageRouting from "./PageRouting";

import { adsLightGreyD } from "./utils/ADSColour";
import { appBarHeight } from "./utils/ADSStyles";
import { StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import "./App.css";

function App() {
  const theme = createTheme();

  const onlinePolling = { enabled: true, url: "https://ipv4.icanhazip.com", interval: 5000, timeout: 5000 };
  const offlinePolling = { enabled: true, url: "https://ipv4.icanhazip.com", interval: 5000, timeout: 5000 };

  const [currentToken, setCurrentToken] = useState<string | undefined>();
  const [currentUser, setCurrentUser] = useState<CurrentUserType | undefined>();
  const [useAuthenticate, setUseAuthenticate] = useState(false);
  const [authenticateId, setAuthenticateId] = useState<string | undefined>();
  const [showLogin, setShowLogin] = useState<boolean>(localStorage.getItem(userStorageName) === null);
  const [showAuthenticate, setShowAuthenticate] = useState(false);
  const [userError, setUserError] = useState<string | undefined>();
  const [loginDetails, setLoginDetails] = useState<AuthenticateDto | undefined>();
  const [displayDialog, setDisplayDialog] = useState(false);

  const loginMessage = useRef("Enter your credentials");
  const userShowMessages = useRef(false);

  // #region Login functions

  /**
   * Method to handle the logoff process.
   *
   * @param {boolean} reload Flag to indicate if the page should be reloaded.
   */
  function HandleLogOff(reload: boolean): void {
    setLoginDetails(undefined);
    setCurrentUser(undefined);
    setCurrentToken(undefined);
    localStorage.removeItem(tokenStorageName);
    localStorage.removeItem(loginStorageName);
    localStorage.removeItem(userStorageName);

    if (reload) window.location.reload();
  }

  /**
   * Method to update the user error message.
   *
   * @param {(AuthenticateDto | undefined)} newLoginDetails The new login details.
   */
  function HandleUpdateLoginDetails(newLoginDetails: AuthenticateDto | undefined): void {
    setLoginDetails(newLoginDetails);
    if (newLoginDetails) {
      setCurrentToken(newLoginDetails.token);
      localStorage.setItem(tokenStorageName, newLoginDetails.token);
      localStorage.setItem(loginStorageName, JSON.stringify(newLoginDetails));
    } else {
      localStorage.removeItem(tokenStorageName);
      localStorage.removeItem(loginStorageName);
      localStorage.removeItem(userStorageName);
    }
  }

  /**
   * Method to update the current user.
   *
   * @param {(CurrentUserType | undefined)} newCurrentUser The new current user.
   */
  function HandleUpdateCurrentUser(newCurrentUser: CurrentUserType | undefined): void {
    setCurrentUser(newCurrentUser);
    if (newCurrentUser) {
      userShowMessages.current =
        newCurrentUser.active &&
        newCurrentUser.extraInformation &&
        newCurrentUser.extraInformation.length > 0 &&
        !!newCurrentUser.extraInformation.find((x) => x.key === "ShowMessages" && x.value === "true");
      setShowLogin(false);
      localStorage.setItem(userStorageName, JSON.stringify(newCurrentUser));
    }
  }

  /**
   * Method to handle when the authorisation has expired.
   */
  function HandleAuthorisationExpired(): void {
    localStorage.removeItem(loginStorageName);
    localStorage.removeItem(tokenStorageName);
    localStorage.removeItem(userStorageName);
    loginMessage.current = "Authorisation has expired, re-enter your credentials.";
    setShowLogin(true);
  }

  /**
   * Method to handle when the user reloads the page.
   */
  function HandleUserReload(): void {
    if (localStorage.getItem(loginStorageName) !== null && !loginDetails) {
      const storedLogin: string | null = localStorage.getItem(loginStorageName);
      if (storedLogin) {
        const savedLogin = JSON.parse(storedLogin);
        setLoginDetails(savedLogin);
        setCurrentToken(savedLogin.token);
      }
    }

    if (localStorage.getItem(userStorageName) !== null && !currentUser) {
      const storedUser: string | null = localStorage.getItem(userStorageName);
      if (storedUser) {
        const savedUser = JSON.parse(storedUser);
        setCurrentUser(savedUser);
      }
    }
  }

  /**
   * Method to handle the login dialog close event.
   */
  const handleLoginClose = () => {
    setShowLogin(false);
  };

  // #endregion Login functions

  return (
    <UserContext.Provider
      value={{
        currentToken: currentToken,
        currentUser: currentUser,
        useAuthenticate: useAuthenticate,
        authenticateId: authenticateId,
        showLogin: showLogin,
        showAuthenticate: showAuthenticate,
        userError: userError,
        loginDetails: loginDetails,
        showMessages: userShowMessages.current,
        displayDialog: displayDialog,
        logoff: HandleLogOff,
        updateUserError: setUserError,
        updateLoginDetails: HandleUpdateLoginDetails,
        updateCurrentUser: HandleUpdateCurrentUser,
        updateShowLogin: setShowLogin,
        updateAuthenticateId: setAuthenticateId,
        updateShowAuthenticate: setShowAuthenticate,
        updateUseAuthenticate: setUseAuthenticate,
        onExpired: HandleAuthorisationExpired,
        onReload: HandleUserReload,
        onDisplayDialog: setDisplayDialog,
      }}
    >
      <StyledEngineProvider injectFirst>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <ConfigContextProvider>
              <ClusterContextProvider>
                <Online polling={onlinePolling}>
                  <Fragment>
                    <div style={{ display: "flex" }}>
                      <CssBaseline />
                      <ADSAppBar />
                      <ADSNavContent />
                      <main style={{ flexGrow: 1, paddingLeft: "10px", paddingRight: "10px" }}>
                        <div style={{ height: `${appBarHeight}px` }} />
                        <PageRouting />
                      </main>
                    </div>
                  </Fragment>
                  <LoginDialog
                    isOpen={showLogin}
                    title={appTitle}
                    message={loginMessage.current}
                    onClose={handleLoginClose}
                  />
                </Online>
                <Offline polling={offlinePolling}>
                  <Box
                    sx={{
                      paddingTop: "30px",
                      textAlign: "center",
                      backgroundColor: adsLightGreyD,
                      height: "100vh",
                    }}
                  >
                    <Stack
                      direction="column"
                      spacing={2}
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: "100vh" }}
                    >
                      <WifiOffIcon sx={{ height: "100px", width: "100px" }} />
                      <Typography variant="h1" sx={{ marginBottom: "5px" }}>
                        Couldn't connect
                      </Typography>
                      <Typography variant="h4" sx={{ margin: "0" }}>
                        Check your internet connection and try again.
                      </Typography>
                    </Stack>
                  </Box>
                </Offline>
              </ClusterContextProvider>
            </ConfigContextProvider>
          </ThemeProvider>
        </BrowserRouter>
      </StyledEngineProvider>
    </UserContext.Provider>
  );
}

export default App;
