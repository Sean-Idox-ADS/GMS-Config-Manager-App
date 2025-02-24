//#region header */
/**************************************************************************************************
//
//  Description: UserContext type
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

import AuthenticateDto from "../dtos/authenticateDto";
import CurrentUserType from "./currentUserType";

export default interface UserContextType {
  currentToken: string | undefined;
  currentUser: CurrentUserType | undefined;
  useAuthenticate: boolean;
  authenticateId: string | undefined;
  showLogin: boolean;
  showAuthenticate: boolean;
  userError: string | undefined;
  loginDetails: AuthenticateDto | undefined;
  logoff(reload: boolean): void;
  updateUserError(newUserError: string | undefined): void;
  updateLoginDetails(newLoginDetails: AuthenticateDto | undefined): void;
  updateCurrentUser(newCurrentUser: CurrentUserType | undefined): void;
  updateShowLogin(newShowLogin: boolean): void;
  updateAuthenticateId(newAuthenticateId: string | undefined): void;
  updateShowAuthenticate(newShowAuthenticate: boolean): void;
  updateUseAuthenticate(newUseAuthenticate: boolean): void;
  onExpired(): void;
  onReload(): void;
}
