//#region header */
/**************************************************************************************************
//
//  Description: Home page
//
//  Copyright:    © 2025 Idox Software Limited
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
//#region Version 1.0.0.0 changes
//    001   24.02.25 Sean Flook          GMSCM-1 Initial Revision.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

import { ReactElement } from "react";
import { SvgIcon } from "@mui/material";

/**
 * Method to get the copy icon.
 *
 * @param {object} props The passed in properties.
 * @returns {JSX.Element} The copy icon.
 */
export function CopyIcon(props: any): ReactElement {
  return (
    <SvgIcon {...props}>
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </SvgIcon>
  );
}

/**
 * Method to get the move icon.
 *
 * @param {object} props The passed in properties.
 * @returns {JSX.Element} The move icon.
 */
export function MoveIcon(props: any): ReactElement {
  return (
    <SvgIcon {...props}>
      <g>
        <path d="M18.586,20.015L15,20.015L15,22.015L22,22.015L22,15L20,15L20,18.601L16.732,15.333L15.318,16.747L18.586,20.015ZM5.429,20L9.015,20L9.015,22L2.015,22L2.015,14.985L4.015,14.985L4.015,18.586L7.283,15.318L8.697,16.732L5.429,20ZM11.98,7.96C14.199,7.96 16,9.761 16,11.98C16,14.199 14.199,16 11.98,16C9.761,16 7.96,14.199 7.96,11.98C7.96,9.761 9.761,7.96 11.98,7.96ZM18.586,4L15,4L15,2L22,2L22,9.015L20,9.015L20,5.414L16.732,8.682L15.318,7.268L18.586,4ZM5.429,4L9.015,4L9.015,2L2.015,2L2.015,9.015L4.015,9.015L4.015,5.414L7.283,8.682L8.697,7.268L5.429,4Z" />
      </g>
    </SvgIcon>
  );
}
