//#region header */
/**************************************************************************************************
//
//  Description: Main page
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

import { Fragment } from "react";
import ADSNavContent from "../components/ADSNavContent";
import PageRouting from "../PageRouting";

const MainPage = () => {
  return (
    <Fragment>
      <ADSNavContent />
      <main style={{ flexGrow: 1, paddingLeft: "10px", paddingRight: "10px" }}>
        <PageRouting />
      </main>
    </Fragment>
  );
};

export default MainPage;
