// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Page routing
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

import { ReactElement, useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import UserContext from "./context/UserContext";

import { hasLoginExpired, loginStorageName } from "./utils/HelperUtils";

import DocumentsPage from "./pages/DocumentsPage";
import ClusterPage from "./pages/ClusterPage";

export const DocumentsRoute = "/documents";
export const ClusterRoute = "/cluster";

const PageRouting = (): ReactElement => {
  const userContext = useContext(UserContext);

  useEffect(() => {
    if (localStorage.getItem(loginStorageName) !== null) {
      const storedLogin: string | null = localStorage.getItem(loginStorageName);
      if (storedLogin) {
        const savedLogin = JSON.parse(storedLogin);
        if (savedLogin.expiry && hasLoginExpired(savedLogin.expiry)) {
          userContext.onExpired();
        } else {
          userContext.onReload();
        }
      }
    }
  }, [userContext]);

  return userContext.currentUser ? (
    <Routes>
      <Route path={ClusterRoute} element={<ClusterPage />} />
      <Route path="*" element={<DocumentsPage />} />
    </Routes>
  ) : (
    <></>
  );
};

export default PageRouting;
