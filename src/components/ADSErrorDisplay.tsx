//#region header */
/**************************************************************************************************
//
//  Description: Error display control
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

import React, { Fragment, useEffect, useState } from "react";

import { Grid2, Stack, Typography } from "@mui/material";

import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

import { adsRed } from "../utils/ADSColour";

interface ADSErrorDisplayProps {
  errorText: string | string[];
  id: string;
}

const ADSErrorDisplay: React.FC<ADSErrorDisplayProps> = ({ errorText, id }) => {
  const [errorString, setErrorString] = useState<string>("");

  useEffect(() => {
    setErrorString(Array.isArray(errorText) ? errorText.join(", ") : errorText);
  }, [errorText]);

  return errorString && errorString.length > 0 ? (
    <Fragment>
      <Grid2 size={3} />
      <Grid2 size={9}>
        <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={0.25} sx={{ pl: "4px" }}>
          <PriorityHighIcon sx={{ color: adsRed, height: "16px", width: "16px" }} />
          <Stack direction="column">
            {errorString.split(", ").map((rec, idx) => (
              <Typography
                id={`${id}-${idx}`}
                variant="caption"
                align="left"
                key={`error-${id}-${idx}`}
                sx={{ fontWeight: 600, fontSize: "14px", color: adsRed }}
              >
                {`${rec.replace("¬", ",")}`}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Grid2>
    </Fragment>
  ) : (
    <></>
  );
};

export default ADSErrorDisplay;
