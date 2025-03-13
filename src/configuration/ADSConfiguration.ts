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
//    002   12.03.25 Sean Flook          GMSCM-1 Code required for managing the configuration and cluster documents.
//    003   13.03.25 Sean Flook          GMSCM-1 Added code to handle when a users token has expired.
// endregion Version 1.0.0.0
//
//--------------------------------------------------------------------------------------------------
// endregion header

import axios from "axios";

import AuthenticateDto from "../dtos/authenticateDto";
import WhoAmIDto from "../dtos/whoAmIDto";
import LoginDto from "../dtos/LoginDto";
import MultiTenantConfigGetDto, {
  MultiTenantConfigPostDto,
  MultiTenantConfigPutDto,
} from "../dtos/multiTenantConfigDto";
import MultiTenantClusterGetDto, {
  MultiTenantClusterPostDto,
  MultiTenantClusterPutDto,
} from "../dtos/multiTenantClusterDto";
import ClusterErrorType from "../models/clusterErrorType";
import ConfigErrorType from "../models/configErrorType";

type ConfigInfo = {
  securityApi: string | undefined;
  securityVersion: string | undefined;
  securityBaseUrl: string | undefined;
  multiTenantApi: string | undefined;
  multiTenantVersion: string | undefined;
  multiTenantBaseUrl: string | undefined;
};

let currentConfig: ConfigInfo = {
  securityApi: undefined,
  securityVersion: undefined,
  securityBaseUrl: undefined,
  multiTenantApi: undefined,
  multiTenantVersion: undefined,
  multiTenantBaseUrl: undefined,
};

/**
 * Method to get the configuration information from the environment variables.
 */
const getConfigInfo = (): void => {
  if (!currentConfig || !currentConfig.securityApi || currentConfig.securityApi.length === 0) {
    currentConfig = {
      securityApi: process.env.REACT_APP_SECURITY_API,
      securityVersion: process.env.REACT_APP_SECURITY_VERSION,
      securityBaseUrl: `${process.env.REACT_APP_SECURITY_API}/api/v${process.env.REACT_APP_SECURITY_VERSION}`,
      multiTenantApi: process.env.REACT_APP_MULTI_TENANT_API,
      multiTenantVersion: process.env.REACT_APP_MULTI_TENANT_VERSION,
      multiTenantBaseUrl: `${process.env.REACT_APP_MULTI_TENANT_API}/api`,
    };
  }
};

/**
 * Method to call the Login end point.
 *
 * @param auditName The audit name used to login the user
 * @param password The password for the audit name.
 * @param errorHandler method to handle error messages.
 * @returns {string | undefined} returns the authorisation id for the user.
 */
export async function LoginUser(
  auditName: string,
  password: string,
  errorHandler: (error: string[]) => void
): Promise<string | undefined> {
  getConfigInfo();

  const securityService = axios.create({
    baseURL: currentConfig.securityBaseUrl,
    headers: { "Content-Type": "application/json" },
  });

  if (process.env.NODE_ENV === "development") {
    console.log(
      "[DEBUG] LoginUser",
      `${currentConfig.securityBaseUrl}/Authority/Login`,
      JSON.stringify({ auditName: auditName, password: password })
    );
  }

  const response: LoginDto | undefined = await securityService
    .post<LoginDto>("/Authority/Login", JSON.stringify({ auditName: auditName, password: password }))
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        if (process.env.NODE_ENV === "development") {
          console.log("[DEBUG] LoginUser", `[ERROR ${error.response.status}]: ${error.response.data}`);
          errorHandler && errorHandler([`[ERROR ${error.response.status}]: ${error.response.data}`]);
        } else {
          switch (error.response.status) {
            case 400:
              errorHandler && errorHandler(["You need to enter a valid username and password, please try again."]);
              break;

            case 401:
              errorHandler && errorHandler(["Unknown username or password, please try again."]);
              break;

            default:
              errorHandler && errorHandler(["An unknown error occurred, please report to support."]);
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
  errorHandler: (error: string[]) => void
): Promise<AuthenticateDto | undefined> {
  getConfigInfo();

  const securityService = axios.create({
    baseURL: currentConfig.securityBaseUrl,
    headers: { "Content-Type": "application/json" },
  });

  if (process.env.NODE_ENV === "development") {
    console.log(
      "[DEBUG] AuthoriseUser",
      `${currentConfig.securityBaseUrl}/Authority/Authenticate/${authoriseId}/${code}`
    );
  }

  const response = await securityService
    .post<AuthenticateDto>(`/Authority/Authenticate/${authoriseId}/${code}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        if (process.env.NODE_ENV === "development") {
          console.log("[DEBUG] AuthoriseUser", `[ERROR ${error.response.status}]: ${error.response.data}`);
          errorHandler && errorHandler([`[ERROR ${error.response.status}]: ${error.response.data}`]);
        } else {
          switch (error.response.status) {
            case 400:
              errorHandler && errorHandler(["An error has occurred during Authentication, please try again."]);
              break;

            case 401:
              errorHandler && errorHandler(["Cannot verify authenticate code, please try again."]);
              break;

            default:
              errorHandler && errorHandler(["An unknown error occurred, please report to support."]);
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
export async function WhoAmI(
  userToken: string | undefined,
  errorHandler: (error: string[]) => void
): Promise<WhoAmIDto | undefined> {
  if (userToken) {
    getConfigInfo();

    const securityService = axios.create({
      baseURL: currentConfig.securityBaseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    });

    const response = await securityService.get<WhoAmIDto>("/Authority/WhoAmI");

    return response.data;
  } else {
    errorHandler && errorHandler(["Token is invalid"]);
    return undefined;
  }
}

/**
 * Method to call the ResendEmail end point.
 *
 * @param authoriseId The authorise id returned by the Login end point for the user.
 * @param errorHandler method to handle error messages.
 */
export function ResendEmail(authoriseId: string, errorHandler: (error: string[]) => void): void {
  getConfigInfo();

  const securityService = axios.create({
    baseURL: currentConfig.securityBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (process.env.NODE_ENV === "development") {
    console.log("[DEBUG] ResendEmail", `${currentConfig.securityBaseUrl}/Authority/ResendEmail/${authoriseId}`);
  }

  securityService.post<AuthenticateDto>(`/Authority/ResendEmail/${authoriseId}`).catch((error) => {
    if (error.response) {
      if (process.env.NODE_ENV === "development") {
        console.log("[DEBUG] ResendEmail", `[ERROR ${error.response.status}]: ${error.response.data}`);
        errorHandler && errorHandler([`[ERROR ${error.response.status}]: ${error.response.data}`]);
      } else {
        switch (error.response.status) {
          case 400:
            errorHandler && errorHandler(["An error has occurred during resend email, please try again."]);
            break;

          case 401:
            errorHandler && errorHandler(["Cannot verify authenticate code, please try again."]);
            break;

          default:
            errorHandler && errorHandler(["An unknown error occurred, please report to support."]);
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
 * @returns {string | void} The reset id for the user or undefined if failed.
 */
export async function SendPasswordResetCode(
  username: string,
  errorHandler: (error: string[]) => void
): Promise<string | void> {
  getConfigInfo();

  const securityService = axios.create({
    baseURL: currentConfig.securityBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (process.env.NODE_ENV === "development") {
    console.log(
      "[DEBUG] SendPasswordResetCode",
      `${currentConfig.securityBaseUrl}/Authority/SendPasswordResetCode/?audit_name=${encodeURIComponent(username)}`
    );
  }

  const response: string | void = await securityService
    .post<string>(`/Authority/SendPasswordResetCode/?audit_name=${encodeURIComponent(username)}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        if (process.env.NODE_ENV === "development") {
          console.log("[DEBUG] SendPasswordResetCode", `[ERROR ${error.response.status}]: ${error.response.data}`);
          errorHandler && errorHandler([`[ERROR ${error.response.status}]: ${error.response.data}`]);
        } else {
          switch (error.response.status) {
            case 400:
              errorHandler &&
                errorHandler(["An error has occurred during send password reset code, please try again."]);
              break;

            case 401:
              errorHandler && errorHandler(["Cannot verify authenticate code, please try again."]);
              break;

            default:
              errorHandler && errorHandler(["An unknown error occurred, please report to support."]);
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
export async function ValidatePassword(
  password: string,
  errorHandler: (error: string[]) => void
): Promise<boolean | void> {
  getConfigInfo();

  const securityService = axios.create({
    baseURL: currentConfig.securityBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (process.env.NODE_ENV === "development") {
    console.log(
      "[DEBUG] ValidatePassword",
      `${currentConfig.securityBaseUrl}/Authority/Validate?strPassword=${encodeURIComponent(password)}`
    );
  }

  const response: boolean | void = await securityService
    .get<boolean>(`/Password/Validate?strPassword=${encodeURIComponent(password)}`)
    .then((response) => {
      if (response.status === 200) return true;
      else return false;
    })
    .catch((error) => {
      if (error.response) {
        if (process.env.NODE_ENV === "development") {
          console.log("[DEBUG] ValidatePassword", `[ERROR ${error.response.status}]: ${error.response.data}`);
          errorHandler && errorHandler([`[ERROR ${error.response.status}]: ${error.response.data}`]);
        } else {
          errorHandler && errorHandler(["An error has occurred whilst validating the password."]);
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
  errorHandler: (error: string[]) => void
): Promise<boolean | void> {
  getConfigInfo();

  const securityService = axios.create({
    baseURL: currentConfig.securityBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (process.env.NODE_ENV === "development") {
    console.log(
      "[DEBUG] ResetMyPassword",
      `${currentConfig.securityBaseUrl}/Authority/ResetMyPassword`,
      JSON.stringify({ resetId: resetId, code: code, password: password, confirmPassword: confirmPassword })
    );
  }

  const response: boolean | void = await securityService
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
          console.log("[DEBUG] ResetMyPassword", `[ERROR ${error.response.status}]: ${error.response.data}`);
          errorHandler && errorHandler([`[ERROR ${error.response.status}]: ${error.response.data}`]);
        } else {
          errorHandler && errorHandler(["An error has occurred whilst resetting the password."]);
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
export async function UpdateMyPassword(
  password: string,
  errorHandler: (error: string[]) => void
): Promise<boolean | void> {
  getConfigInfo();

  const securityService = axios.create({
    baseURL: currentConfig.securityBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (process.env.NODE_ENV === "development") {
    console.log("[DEBUG] UpdateMyPassword", `${currentConfig.securityBaseUrl}/Authority/ResetMyPassword`, password);
  }

  const response: boolean | void = await securityService
    .put<boolean>("/Authority/ResetMyPassword", JSON.stringify({ password: password }))
    .then((response) => {
      if (response.status === 200) return true;
      else return false;
    })
    .catch((error) => {
      if (error.response) {
        if (process.env.NODE_ENV === "development") {
          console.log("[DEBUG] UpdateMyPassword", `[ERROR ${error.response.status}]: ${error.response.data}`);
          errorHandler && errorHandler([`[ERROR ${error.response.status}]: ${error.response.data}`]);
        } else {
          errorHandler && errorHandler(["An error has occurred whilst updating the password."]);
        }
      }
      return false;
    });

  return response;
}

/**
 * Method to call the MultiTenantConfig get endpoint.
 *
 * @param userToken The user token for the current user
 * @param errorHandler method to handle error messages.
 * @returns {MultiTenantConfigGetDto[] | undefined} The multi-tenant configuration data or undefined if failed.
 */
export async function GetMultiTenantConfig(
  userToken: string | undefined,
  errorHandler: (error: string) => void,
  unauthorizedHandler: (unauthorized: boolean) => void
): Promise<MultiTenantConfigGetDto[] | undefined> {
  if (userToken) {
    getConfigInfo();

    const multiTenantService = axios.create({
      baseURL: currentConfig.multiTenantBaseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    });

    const response = await multiTenantService
      .get<MultiTenantConfigGetDto[]>("/MultiTenantConfig")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            unauthorizedHandler && unauthorizedHandler(true);
          } else {
            if (process.env.NODE_ENV === "development") {
              console.log("[DEBUG] GetMultiTenantConfig", `[ERROR ${error.response.status}]: ${error.response.data}`);
              errorHandler && errorHandler(`[ERROR ${error.response.status}]: ${error.response.data}`);
            } else {
              errorHandler && errorHandler("An unknown error occurred, please report to support.");
            }
          }
        }
        return undefined;
      });

    return response;
  } else {
    unauthorizedHandler && unauthorizedHandler(true);
    errorHandler && errorHandler("Token is invalid");
    return undefined;
  }
}

/**
 * Method to call the MultiTenantConfig post endpoint.
 *
 * @param userToken The user token for the current user
 * @param config The new configuration data
 * @param errorHandler method to handle error messages.
 * @returns {boolean} True if the new config was added successfully; otherwise false.
 */
export async function PostMultiTenantConfig(
  userToken: string | undefined,
  config: MultiTenantConfigPostDto,
  id: string,
  errorHandler: (error: ConfigErrorType[] | undefined) => void,
  unauthorizedHandler: (unauthorized: boolean) => void
): Promise<MultiTenantConfigGetDto | undefined> {
  if (userToken) {
    getConfigInfo();

    const multiTenantService = axios.create({
      baseURL: currentConfig.multiTenantBaseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log(
        "[DEBUG] PostMultiTenantConfig",
        `${currentConfig.multiTenantBaseUrl}/MultiTenantConfig`,
        JSON.stringify(config)
      );
    }

    const response = await multiTenantService
      .post<MultiTenantConfigGetDto>("/MultiTenantConfig", JSON.stringify(config))
      .then((response) => {
        if (response.status === 201) return response.data;
        else {
          errorHandler && errorHandler([{ id: id, field: "name", errors: ["A no content error was received."] }]);
          return undefined;
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            unauthorizedHandler && unauthorizedHandler(true);
          } else {
            if (process.env.NODE_ENV === "development") {
              console.log("[DEBUG] PostMultiTenantConfig", `[ERROR ${error.response.status}]: ${error.response.data}`);
              errorHandler &&
                errorHandler([
                  {
                    id: id,
                    field: "name",
                    errors: [`[ERROR ${error.response.status}]: ${error.response.data}`],
                  },
                ]);
            } else {
              errorHandler &&
                errorHandler([
                  {
                    id: id,
                    field: "name",
                    errors: ["An error has occurred whilst adding a new configuration."],
                  },
                ]);
            }
          }
        }
        return undefined;
      });

    return response;
  } else {
    unauthorizedHandler && unauthorizedHandler(true);
    errorHandler && errorHandler([{ id: id, field: "name", errors: ["Token is invalid"] }]);
    return undefined;
  }
}

/**
 * Method to call the MultiTenantConfig putt endpoint.
 *
 * @param userToken The user token for the current user
 * @param config The updated configuration data
 * @param errorHandler method to handle error messages.
 * @returns {boolean} True if the new config was updated successfully; otherwise false.
 */
export async function PutMultiTenantConfig(
  userToken: string | undefined,
  config: MultiTenantConfigPutDto,
  id: string,
  errorHandler: (error: ConfigErrorType[] | undefined) => void,
  unauthorizedHandler: (unauthorized: boolean) => void
): Promise<MultiTenantConfigGetDto | undefined> {
  if (userToken) {
    getConfigInfo();

    const multiTenantService = axios.create({
      baseURL: currentConfig.multiTenantBaseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log(
        "[DEBUG] PutMultiTenantConfig",
        `${currentConfig.multiTenantBaseUrl}/MultiTenantConfig`,
        JSON.stringify(config)
      );
    }

    const response = await multiTenantService
      .put<MultiTenantConfigGetDto>("/MultiTenantConfig", JSON.stringify(config))
      .then((response) => {
        if (response.status === 200) return response.data;
        else {
          errorHandler && errorHandler([{ id: id, field: "name", errors: ["A no content error was received."] }]);
          return undefined;
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            unauthorizedHandler && unauthorizedHandler(true);
          } else {
            if (process.env.NODE_ENV === "development") {
              console.log("[DEBUG] PutMultiTenantConfig", `[ERROR ${error.response.status}]: ${error.response.data}`);
              errorHandler &&
                errorHandler([
                  {
                    id: id,
                    field: "name",
                    errors: [`[ERROR ${error.response.status}]: ${error.response.data}`],
                  },
                ]);
            } else {
              errorHandler &&
                errorHandler([
                  {
                    id: id,
                    field: "name",
                    errors: ["An error has occurred whilst updating a configuration."],
                  },
                ]);
            }
          }
        }
        return undefined;
      });

    return response;
  } else {
    unauthorizedHandler && unauthorizedHandler(true);
    errorHandler && errorHandler([{ id: id, field: "name", errors: ["Token is invalid"] }]);
    return undefined;
  }
}

/**
 * Method to call the MultiTenantCluster get endpoint.
 *
 * @param userToken The user token for the current user
 * @param errorHandler method to handle error messages.
 * @returns {MultiTenantClusterGetDto[] | undefined} The multi-tenant cluster data or undefined if failed.
 */
export async function GetMultiTenantCluster(
  userToken: string | undefined,
  errorHandler: (error: string) => void,
  unauthorizedHandler: (unauthorized: boolean) => void
): Promise<MultiTenantClusterGetDto[] | undefined> {
  if (userToken) {
    getConfigInfo();

    const multiTenantService = axios.create({
      baseURL: currentConfig.multiTenantBaseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    });

    const response = await multiTenantService
      .get<MultiTenantClusterGetDto[]>("/MultiTenantCluster")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            unauthorizedHandler && unauthorizedHandler(true);
          } else {
            if (process.env.NODE_ENV === "development") {
              console.log("[DEBUG] GetMultiTenantCluster", `[ERROR ${error.response.status}]: ${error.response.data}`);
              errorHandler && errorHandler(`[ERROR ${error.response.status}]: ${error.response.data}`);
            } else {
              errorHandler && errorHandler("An unknown error occurred, please report to support.");
            }
          }
        }
        return undefined;
      });

    return response;
  } else {
    unauthorizedHandler && unauthorizedHandler(true);
    errorHandler && errorHandler("Token is invalid");
    return undefined;
  }
}

/**
 * Method to call the MultiTenantCluster post endpoint.
 *
 * @param userToken The user token for the current user
 * @param cluster The new cluster data
 * @param errorHandler method to handle error messages.
 * @returns {MultiTenantClusterGetDto | undefined} The new cluster data or undefined if failed.
 */
export async function PostMultiTenantCluster(
  userToken: string | undefined,
  cluster: MultiTenantClusterPostDto,
  id: string,
  errorHandler: (error: ClusterErrorType[] | undefined) => void,
  unauthorizedHandler: (unauthorized: boolean) => void
): Promise<MultiTenantClusterGetDto | undefined> {
  if (userToken) {
    getConfigInfo();

    const multiTenantService = axios.create({
      baseURL: currentConfig.multiTenantBaseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log(
        "[DEBUG] PostMultiTenantCluster",
        `${currentConfig.multiTenantBaseUrl}/MultiTenantCluster`,
        JSON.stringify(cluster)
      );
    }

    const response: MultiTenantClusterGetDto | undefined = await multiTenantService
      .post<MultiTenantClusterGetDto>("/MultiTenantCluster", JSON.stringify(cluster))
      .then((response) => {
        if (response.status === 201) return response.data;
        else return undefined;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            unauthorizedHandler && unauthorizedHandler(true);
          } else {
            if (process.env.NODE_ENV === "development") {
              console.log("[DEBUG] PostMultiTenantCluster", `[ERROR ${error.response.status}]: ${error.response.data}`);
              errorHandler &&
                errorHandler([
                  {
                    id: id,
                    field: "name",
                    errors: [`[ERROR ${error.response.status}]: ${error.response.data}`],
                  },
                ]);
            } else {
              errorHandler &&
                errorHandler([
                  { id: id, field: "name", errors: ["An error has occurred whilst adding a new cluster."] },
                ]);
            }
          }
        }
        return undefined;
      });

    return response;
  } else {
    unauthorizedHandler && unauthorizedHandler(true);
    errorHandler && errorHandler([{ id: id, field: "name", errors: ["Token is invalid"] }]);
    return undefined;
  }
}

/**
 * Method to call the MultiTenantCluster put endpoint.
 *
 * @param userToken The user token for the current user
 * @param cluster The updated cluster data
 * @param errorHandler method to handle error messages.
 * @returns {MultiTenantClusterGetDto | undefined} The updated cluster data or undefined if failed.
 */
export async function PutMultiTenantCluster(
  userToken: string | undefined,
  cluster: MultiTenantClusterPutDto,
  id: string,
  errorHandler: (error: ClusterErrorType[] | undefined) => void,
  unauthorizedHandler: (unauthorized: boolean) => void
): Promise<MultiTenantClusterGetDto | undefined> {
  if (userToken) {
    getConfigInfo();

    const multiTenantService = axios.create({
      baseURL: currentConfig.multiTenantBaseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log(
        "[DEBUG] PutMultiTenantCluster",
        `${currentConfig.multiTenantBaseUrl}/MultiTenantCluster`,
        JSON.stringify(cluster)
      );
    }

    const response: MultiTenantClusterGetDto | undefined = await multiTenantService
      .put<MultiTenantClusterGetDto>("/MultiTenantCluster", JSON.stringify(cluster))
      .then((response) => {
        if (response.status === 200) return response.data;
        else return undefined;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            unauthorizedHandler && unauthorizedHandler(true);
          } else {
            if (process.env.NODE_ENV === "development") {
              console.log("[DEBUG] PostMultiTenantCluster", `[ERROR ${error.response.status}]: ${error.response.data}`);
              errorHandler &&
                errorHandler([
                  {
                    id: id,
                    field: "name",
                    errors: [`[ERROR ${error.response.status}]: ${error.response.data}`],
                  },
                ]);
            } else {
              errorHandler &&
                errorHandler([{ id: id, field: "name", errors: ["An error has occurred whilst updating a cluster."] }]);
            }
          }
        }
        return undefined;
      });

    return response;
  } else {
    unauthorizedHandler && unauthorizedHandler(true);
    errorHandler && errorHandler([{ id: id, field: "name", errors: ["Token is invalid"] }]);
    return undefined;
  }
}

/**
 * Method to get the list of organisations for the current user.
 *
 * @param userToken The user token for the current user
 * @param errorHandler method to handle error messages.
 * @return {string[] | undefined} The list of organisations for the current user or undefined if failed.
 */
export async function Organisations(
  userToken: string | undefined,
  errorHandler: (error: string) => void,
  unauthorizedHandler: (unauthorized: boolean) => void
): Promise<string[] | undefined> {
  if (userToken) {
    getConfigInfo();

    const securityService = axios.create({
      baseURL: currentConfig.securityBaseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[DEBUG] Organisations", `${currentConfig.securityBaseUrl}/meta/organisations`);
    }

    const response = await securityService
      .get<string[]>("/meta/organisations")
      .then((response) => {
        if (response.status === 200) return response.data;
        else return undefined;
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            unauthorizedHandler && unauthorizedHandler(true);
          } else {
            if (process.env.NODE_ENV === "development") {
              console.log("[DEBUG] PostMultiTenantCluster", `[ERROR ${error.response.status}]: ${error.response.data}`);
              errorHandler && errorHandler(`[ERROR ${error.response.status}]: ${error.response.data}`);
            } else {
              errorHandler && errorHandler("An error has occurred whilst updating a cluster.");
            }
          }
        }
        return undefined;
      });

    return response;
  } else {
    unauthorizedHandler && unauthorizedHandler(true);
    errorHandler && errorHandler("Token is invalid");
    return undefined;
  }
}
