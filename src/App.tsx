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
// endregion Version 1.0.0.0
//
//--------------------------------------------------------------------------------------------------
// endregion header

import { Fragment, useRef, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import UserContext from "./context/userContext";

import { appTitle, loginStorageName, tokenStorageName, userStorageName } from "./utils/HelperUtils";

import AuthenticateDto from "./dtos/authenticateDto";
import CurrentUserType from "./models/currentUserType";

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

  // #region userContext states
  const [currentToken, setCurrentToken] = useState<string | undefined>();
  const [loginDetails, setLoginDetails] = useState<AuthenticateDto | undefined>();
  const [currentUser, setCurrentUser] = useState<CurrentUserType | undefined>();
  const [useAuthenticate, setUseAuthenticate] = useState(false);
  const [authenticateId, setAuthenticateId] = useState<string | undefined>();
  const [showLogin, setShowLogin] = useState<boolean>(localStorage.getItem(userStorageName) === null);
  const [showAuthenticate, setShowAuthenticate] = useState(false);
  const [userError, setUserError] = useState<string | undefined>();
  // #endregion userContext states

  // #region Login states
  const loginMessage = useRef("Enter your credentials");
  // #endregion Login states

  // #region userContext functions
  function logoff(reload: boolean): void {
    setLoginDetails(undefined);
    localStorage.removeItem(tokenStorageName);
    localStorage.removeItem(loginStorageName);
    localStorage.removeItem(userStorageName);

    if (reload) window.location.reload();
  }

  function updateUserError(newUserError: string | undefined): void {
    setUserError(newUserError);
  }

  function updateLoginDetails(newLoginDetails: AuthenticateDto | undefined): void {
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

  function updateCurrentUser(newCurrentUser: CurrentUserType | undefined): void {
    setCurrentUser(newCurrentUser);
    if (newCurrentUser) {
      setShowLogin(false);
      localStorage.setItem(userStorageName, JSON.stringify(newCurrentUser));
    }
  }

  function updateShowLogin(newShowLogin: boolean): void {
    setShowLogin(newShowLogin);
  }

  function updateAuthenticateId(newAuthenticateId: string | undefined): void {
    setAuthenticateId(newAuthenticateId);
  }

  function updateShowAuthenticate(newShowAuthenticate: boolean): void {
    setShowAuthenticate(newShowAuthenticate);
  }

  function updateUseAuthenticate(newUseAuthenticate: boolean): void {
    setUseAuthenticate(newUseAuthenticate);
  }

  function HandleAuthorisationExpired(): void {
    localStorage.removeItem(loginStorageName);
    localStorage.removeItem(tokenStorageName);
    localStorage.removeItem(userStorageName);
    loginMessage.current = "Authorisation has expired, re-enter your credentials.";
    setShowLogin(true);
  }

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
  // #endregion userContext functions

  // #region Login functions
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
        logoff: logoff,
        updateUserError: updateUserError,
        updateLoginDetails: updateLoginDetails,
        updateCurrentUser: updateCurrentUser,
        updateShowLogin: updateShowLogin,
        updateAuthenticateId: updateAuthenticateId,
        updateShowAuthenticate: updateShowAuthenticate,
        updateUseAuthenticate: updateUseAuthenticate,
        onExpired: HandleAuthorisationExpired,
        onReload: HandleUserReload,
      }}
    >
      <StyledEngineProvider injectFirst>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
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
          </ThemeProvider>
        </BrowserRouter>
      </StyledEngineProvider>
    </UserContext.Provider>
  );
}

export default App;
