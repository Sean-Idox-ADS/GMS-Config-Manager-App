//#region header */
/**************************************************************************************************
//
//  Description: All the styling used by the app
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

import {
  adsBlueA,
  adsDarkGrey,
  adsDarkRed,
  adsLightBlue,
  adsLightGreyA,
  adsMidGreyA,
  adsMidGreyA10,
  adsOffWhite,
  adsRed,
  adsRed10,
  adsWhite,
} from "./ADSColour";

export const navBarWidth: number = 60;
export const drawerWidth: number = 400;

export const toolbarHeight: number = 40;
export const dataFormToolbarHeight: number = 50;
export const appBarHeight: number = 56;

export function ActionIconStyle() {
  return {
    color: "#2A6EBB",
    "&:hover": {
      color: "#7f7f7f",
    },
  };
}

/**
 * The styling used for a red button.
 */
export const redButtonStyle = {
  color: adsWhite,
  backgroundColor: adsRed,
  textTransform: "none",
  "&:hover": {
    backgroundColor: adsDarkRed,
    color: adsWhite,
  },
};

/**
 * The styling used for a blue button.
 */
export const blueButtonStyle = {
  color: adsWhite,
  backgroundColor: adsBlueA,
  textTransform: "none",
  "&:hover": {
    backgroundColor: adsLightBlue,
    color: adsWhite,
  },
};

/**
 * The styling used for a white button.
 */
export const whiteButtonStyle = {
  color: adsBlueA,
  backgroundColor: adsWhite,
  textTransform: "none",
  "&:hover": {
    backgroundColor: adsLightBlue,
    color: adsWhite,
  },
};

/**
 * The styling used for an off white button.
 */
export const offWhiteButtonStyle = {
  color: adsBlueA,
  backgroundColor: adsOffWhite,
  textTransform: "none",
  "&:hover": {
    backgroundColor: adsLightBlue,
    color: adsWhite,
  },
};

/**
 * The styling used for a grey button.
 */
export const greyButtonStyle = {
  color: adsMidGreyA,
  backgroundColor: adsLightGreyA,
  textTransform: "none",
  "&:hover": {
    backgroundColor: adsLightBlue,
    color: adsWhite,
  },
};

/**
 * The styling used for a white button.
 */
export const transparentButtonStyle = {
  color: adsBlueA,
  backgroundColor: "inherit",
  textTransform: "none",
  "&:hover": {
    backgroundColor: adsLightBlue,
    color: adsWhite,
  },
};

/**
 * Return the styling for the row box object that contains the component on a form.
 *
 * @param {boolean} hasError True if the component is displaying an error; otherwise false.
 * @return {object} The styling to be used for the form box row.
 */
export function FormBoxRowStyle(hasError: boolean | undefined): object {
  if (hasError)
    return {
      borderLeftStyle: "solid",
      borderLeftWidth: "4px",
      borderLeftColor: adsRed,
    };
  else
    return {
      borderLeftStyle: "none",
    };
}

/**
 * Return the styling for the row object that contains the component on a form.
 *
 * @param {boolean} hasError True if the component is displaying an error; otherwise false.
 * @param {boolean} [noLeftPadding=false] True if no left padding is required; otherwise false.
 * @return {object} The styling to use for the form row.
 */
export function FormRowStyle(hasError: boolean | undefined, noLeftPadding: boolean = false): object {
  if (noLeftPadding) {
    if (hasError)
      return {
        pt: "4px",
        pr: "8px",
        color: adsMidGreyA,
        backgroundColor: adsRed10,
        display: "flex",
        justifyContent: "flex-start",
      };
    else
      return {
        borderLeftStyle: "none",
        pt: "4px",
        pr: "8px",
        color: adsMidGreyA,
        display: "flex",
        justifyContent: "flex-start",
      };
  } else {
    if (hasError)
      return {
        pt: "4px",
        pl: "12px",
        pr: "8px",
        color: adsMidGreyA,
        backgroundColor: adsRed10,
        display: "flex",
        justifyContent: "flex-start",
      };
    else
      return {
        borderLeftStyle: "none",
        pt: "4px",
        pl: "12px",
        pr: "8px",
        color: adsMidGreyA,
        display: "flex",
        justifyContent: "flex-start",
      };
  }
}

/**
 * Returns the styling for an input component.
 *
 * @param {boolean} hasError True if the component is displaying an error; otherwise false.
 * @return {object} The styling to use for the form input.
 */
export function FormInputStyle(hasError: boolean | undefined) {
  if (hasError)
    return {
      fontFamily: "Nunito sans",
      fontSize: "15px",
      color: adsDarkGrey,
      backgroundColor: adsWhite,
      pl: "4px",
      "&$outlinedInputFocused": {
        borderColor: `${adsBlueA}  !important`,
      },
      "&$notchedOutline": {
        borderWidth: "1px",
        borderColor: `${adsRed}  !important`,
      },
    };
  else
    return {
      fontFamily: "Nunito sans",
      fontSize: "15px",
      color: adsDarkGrey,
      backgroundColor: adsWhite,
      "&$outlinedInputFocused": {
        borderColor: `${adsBlueA}  !important`,
      },
      "&$notchedOutline": {
        borderWidth: "1px",
        borderColor: `${adsOffWhite}  !important`,
      },
    };
}

/**
 * The styling used for control labels.
 */
export const controlLabelStyle = { fontSize: "14px", color: adsMidGreyA };

/**
 * The styling used for bold control labels.
 */
export const boldControlLabelStyle = { fontWeight: 700, fontSize: "14px", color: adsMidGreyA };

/**
 * The styling used for tooltips.
 */
export const tooltipStyle = { fontSize: "14px" };

/**
 * The styling used for drawer titles.
 */
export const drawerTitleStyle = { color: adsMidGreyA, fontSize: "24px", pl: "24px" };

/**
 * The styling used for drawer sub-titles
 */
export const drawerSubTitleStyle = { color: adsMidGreyA, fontSize: "18px" };

/**
 * The styling used for drawer text.
 */
export const drawerTextStyle = { color: adsMidGreyA, fontSize: "16px" };

/**
 * The styling used for drawer links.
 */
export const drawerLinkStyle = { color: adsBlueA, fontSize: "16px" };

/**
 * The styling used for drawer small text.
 */
export const drawerSmallTextStyle = { color: adsMidGreyA, fontSize: "15px", pt: "2px" };

/**
 * The styling used for data forms.
 */
export const dataFormStyle = (dataForm: string): object => {
  const maxHeight: number = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  let height: number = maxHeight;

  switch (dataForm) {
    case "ADSNavContent":
      height = maxHeight;
      break;

    case "ADSHomepageControl":
      height = maxHeight - appBarHeight;
      break;

    default:
      height = maxHeight - appBarHeight - dataFormToolbarHeight * 2 - toolbarHeight;
      break;
  }

  switch (dataForm) {
    case "ADSNavContent":
      return {
        pt: "2.4px",
        pb: "24px",
        width: `${navBarWidth}px`,
        height: `${height}px`,
      };

    case "ADSHomepageControl":
      return {
        overflowY: "auto",
        width: "100%",
        height: `${height}px`,
        backgroundColor: adsMidGreyA10,
        pl: "12px",
      };

    default:
      return {
        overflowY: "auto",
        width: "100%",
        height: `${height}px`,
        backgroundColor: adsOffWhite,
        pl: "12px",
      };
  }
};
