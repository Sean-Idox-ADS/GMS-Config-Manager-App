// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: URL data about the api calls we need to make
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

import axios from "axios";
import AuthenticateDto from "../dtos/authenticateDto";
import WhoAmIDto from "../dtos/whoAmIDto";
import LoginDto from "../dtos/LoginDto";

type ConfigInfo = {
  securityApi: string | undefined;
  version: string | undefined;
  baseUrl: string | undefined;
};

let currentConfig: ConfigInfo = { securityApi: undefined, version: undefined, baseUrl: undefined };

/**
 * Method to get the configuration information from the environment variables.
 */
const getConfigInfo = (): void => {
  if (!currentConfig || !currentConfig.securityApi || currentConfig.securityApi.length === 0) {
    currentConfig = {
      securityApi: process.env.REACT_APP_SECURITY_API,
      version: process.env.REACT_APP_SECURITY_VERSION,
      baseUrl: `${process.env.REACT_APP_SECURITY_API}/api/v${process.env.REACT_APP_SECURITY_VERSION}`,
    };
  }
};

/**
 * Method to call the Login end point.
 *
 * @param auditName The audit name used to login the user
 * @param password The password for the audit name.
 * @param errorHandler method to handle error messages.
 * @returns {string} returns the authorisation id for the user.
 */
export async function LoginUser(auditName: string, password: string, errorHandler: any): Promise<string | undefined> {
  getConfigInfo();

  const userService = axios.create({
    baseURL: currentConfig.baseUrl,
    headers: { "Content-Type": "application/json" },
  });

  const response: LoginDto | undefined = await userService
    .post<LoginDto>("/Authority/Login", JSON.stringify({ auditName: auditName, password: password }))
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        if (process.env.NODE_ENV === "development") {
          errorHandler && errorHandler(`[ERROR ${error.response.status}]: ${error.response.data}`);
        } else {
          switch (error.response.status) {
            case 400:
              errorHandler && errorHandler("You need to enter a valid username and password, please try again.");
              break;

            case 401:
              errorHandler && errorHandler("Unknown username or password, please try again.");
              break;

            default:
              errorHandler && errorHandler("An unknown error occurred, please report to support.");
              break;
          }
        }
      }
      return undefined;
    });

  return response ? response.authorizeId : undefined;
}

/**
 * Method to call the authenticate end point.
 *
 * @param authoriseId The authorise id returned by the Login end point for the user.
 * @param code The code sent by the API to users email address
 * @param errorHandler method to handle error messages.
 * @returns {AuthenticateDto | undefined} The authorised user object or undefined if failed to authorise the user.
 */
export async function AuthoriseUser(
  authoriseId: string,
  code: string,
  errorHandler: any
): Promise<AuthenticateDto | undefined> {
  getConfigInfo();

  const userService = axios.create({
    baseURL: currentConfig.baseUrl,
    headers: { "Content-Type": "application/json" },
  });

  const response = await userService
    .post<AuthenticateDto>(`/Authority/Authenticate/${authoriseId}/${code}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        if (process.env.NODE_ENV === "development") {
          errorHandler && errorHandler(`[ERROR ${error.response.status}]: ${error.response.data}`);
        } else {
          switch (error.response.status) {
            case 400:
              errorHandler && errorHandler("An error has occurred during Authentication, please try again.");
              break;

            case 401:
              errorHandler && errorHandler("Cannot verify authenticate code, please try again.");
              break;

            default:
              errorHandler && errorHandler("An unknown error occurred, please report to support.");
              break;
          }
        }
      }
      return undefined;
    });

  return response;
}

/**
 * Method to call the WhoAmI end point.
 *
 * @param userToken The user token for the current user
 * @param errorHandler method to handle error messages.
 * @returns {WhoAmIDto | undefined} The user object for the current user or undefined if failed.
 */
export async function WhoAmI(userToken: string | undefined, errorHandler: any): Promise<WhoAmIDto | undefined> {
  if (userToken) {
    getConfigInfo();

    const userService = axios.create({
      baseURL: currentConfig.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    });

    const response = await userService.get<WhoAmIDto>("/Authority/WhoAmI");

    return response.data;
  } else {
    errorHandler && errorHandler("Token is invalid");
    return undefined;
  }
}

/**
 * Method to call the ResendEmail end point.
 *
 * @param authoriseId The authorise id returned by the Login end point for the user.
 * @param errorHandler method to handle error messages.
 */
export function ResendEmail(authoriseId: string, errorHandler: any): void {
  getConfigInfo();

  const userService = axios.create({
    baseURL: currentConfig.baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  userService.post<AuthenticateDto>(`/Authority/ResendEmail/${authoriseId}`).catch((error) => {
    if (error.response) {
      if (process.env.NODE_ENV === "development") {
        errorHandler && errorHandler(`[ERROR ${error.response.status}]: ${error.response.data}`);
      } else {
        switch (error.response.status) {
          case 400:
            errorHandler && errorHandler("An error has occurred during resend email, please try again.");
            break;

          case 401:
            errorHandler && errorHandler("Cannot verify authenticate code, please try again.");
            break;

          default:
            errorHandler && errorHandler("An unknown error occurred, please report to support.");
            break;
        }
      }
    }
  });
}

/**
 * Method to handle when user has forgotten their password.
 *
 * @param username The users audit name that we need to reset the password for.
 * @param errorHandler method to handle error messages.
 */
export async function SendPasswordResetCode(username: string, errorHandler: any): Promise<string | void> {
  getConfigInfo();

  const userService = axios.create({
    baseURL: currentConfig.baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response: string | void = await userService
    .post<string>(`/Authority/SendPasswordResetCode/?audit_name=${username}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        if (process.env.NODE_ENV === "development") {
          errorHandler && errorHandler(`[ERROR ${error.response.status}]: ${error.response.data}`);
        } else {
          switch (error.response.status) {
            case 400:
              errorHandler && errorHandler("An error has occurred during send password reset code, please try again.");
              break;

            case 401:
              errorHandler && errorHandler("Cannot verify authenticate code, please try again.");
              break;

            default:
              errorHandler && errorHandler("An unknown error occurred, please report to support.");
              break;
          }
        }
      }
      return "";
    });

  return response;
}

/**
 * Method to validate the password.
 *
 * @param password The password to validate
 * @param errorHandler method to handle error messages.
 * @returns {boolean} True if the password is valid; otherwise false
 */
export async function ValidatePassword(password: string, errorHandler: any): Promise<boolean | void> {
  getConfigInfo();

  const userService = axios.create({
    baseURL: currentConfig.baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response: boolean | void = await userService
    .get<boolean>(`/Password/Validate?strPassword=${password}`)
    .then((response) => {
      if (response.status === 200) return true;
      else return false;
    })
    .catch((error) => {
      if (error.response) {
        if (process.env.NODE_ENV === "development") {
          errorHandler && errorHandler(`[ERROR ${error.response.status}]: ${error.response.data}`);
        } else {
          errorHandler && errorHandler("An error has occurred whilst validating the password.");
        }
      }
      return false;
    });

  return response;
}

/**
 * Method used to reset a password.
 *
 * @param resetId The reset id.
 * @param code the authorization code.
 * @param password The new password.
 * @param confirmPassword The confirmation password.
 * @param errorHandler method to handle error messages.
 * @returns {boolean} True if the password was successfully reset; otherwise false.
 */
export async function ResetMyPassword(
  resetId: string,
  code: string,
  password: string,
  confirmPassword: string,
  errorHandler: any
): Promise<boolean | void> {
  getConfigInfo();

  const userService = axios.create({
    baseURL: currentConfig.baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response: boolean | void = await userService
    .post<boolean>(
      "/Authority/ResetMyPassword",
      JSON.stringify({ resetId: resetId, code: code, password: password, confirmPassword: confirmPassword })
    )
    .then((response) => {
      if (response.status === 200) return true;
      else return false;
    })
    .catch((error) => {
      if (error.response) {
        if (process.env.NODE_ENV === "development") {
          errorHandler && errorHandler(`[ERROR ${error.response.status}]: ${error.response.data}`);
        } else {
          errorHandler && errorHandler("An error has occurred whilst resetting the password.");
        }
      }
      return false;
    });

  return response;
}

/**
 * Method used to update a password.
 *
 * @param password The new password.
 * @param errorHandler method to handle error messages.
 * @returns {boolean} True if the password was successfully updated; otherwise false.
 */
export async function UpdateMyPassword(password: string, errorHandler: any): Promise<boolean | void> {
  getConfigInfo();

  const userService = axios.create({
    baseURL: currentConfig.baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response: boolean | void = await userService
    .put<boolean>("/Authority/ResetMyPassword", JSON.stringify({ password: password }))
    .then((response) => {
      if (response.status === 200) return true;
      else return false;
    })
    .catch((error) => {
      if (error.response) {
        if (process.env.NODE_ENV === "development") {
          errorHandler && errorHandler(`[ERROR ${error.response.status}]: ${error.response.data}`);
        } else {
          errorHandler && errorHandler("An error has occurred whilst updating the password.");
        }
      }
      return false;
    });

  return response;
}
