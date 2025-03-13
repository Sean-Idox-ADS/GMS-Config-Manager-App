// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: user Context
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

// region imports

import { createContext } from "react";

import UserContextType from "../models/userContextType";

// endregion imports

/**
 * The user context.
 */
const UserContext = createContext<UserContextType>({} as UserContextType);
UserContext.displayName = "userContext";

export default UserContext;
