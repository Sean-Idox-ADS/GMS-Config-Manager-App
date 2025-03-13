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
//    002   25.02.25 Sean Flook          GMSCM-1 Further required changes.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

import {
  adsBlueA,
  adsDarkGrey,
  adsDarkRed,
  adsLightBlue,
  adsLightBlue10,
  adsLightGreyA,
  adsLightGreyA50,
  adsLightGreyB,
  adsLightGreyC,
  adsMidGreyA,
  adsMidGreyA10,
  adsOffWhite,
  adsPaleBlueA,
  adsRed,
  adsRed10,
  adsRed20,
  adsWhite,
} from "./ADSColour";

export const navBarWidth: number = 60;
export const drawerWidth: number = 400;

export const toolbarHeight: number = 40;
export const filterToolbarHeight: number = 60;
export const dataFormToolbarHeight: number = 50;
export const appBarHeight: number = 56;
export const skeletonHeight: number = 53;

const maxContentHeight = "400px";

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
 * Return the styling for the row box object that contains the component on a form.
 *
 * @param {boolean} hasError True if the component is displaying an error; otherwise false.
 * @return {object} The styling to be used for the form box row.
 */
export function FormBoxReadOnlyRowStyle(hasError: boolean | undefined): object {
  if (hasError)
    return {
      height: "60px",
      pt: "20px",
      borderLeftStyle: "solid",
      borderLeftWidth: "4px",
      borderLeftColor: adsRed,
    };
  else
    return {
      height: "60px",
      pt: "20px",
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
export function FormRowStyle(hasError?: boolean, noLeftPadding?: boolean): object {
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
 * Returns the styling for a select input component.
 *
 * @param {boolean} hasError True if the component is displaying an error; otherwise false.
 * @return {object} The styling to use for the form select input.
 */
export function FormSelectInputStyle(hasError: boolean | undefined): object {
  if (hasError)
    return {
      fontFamily: "Nunito sans",
      fontSize: "15px",
      color: adsDarkGrey,
      backgroundColor: adsWhite,
      display: "inline-flex",
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
      display: "inline-flex",
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
 * The styling used for toolbars.
 */
export const toolbarStyle = {
  backgroundColor: adsWhite,
  borderBottom: `1px solid ${adsLightGreyB}`,
  borderTop: `1px solid ${adsLightGreyB}`,
  pl: "4px",
  pr: "6px",
  width: "100%",
  height: `${toolbarHeight}px`,
  overflowY: "hidden",
};

/**
 * The styling used for filter toolbars.
 */
export const filterToolbarStyle = {
  backgroundColor: adsOffWhite,
  borderBottom: `1px solid ${adsLightGreyB}`,
  pl: "4px",
  pr: "8px",
  width: "100%",
  height: `${filterToolbarHeight}px`,
  overflowY: "hidden",
};

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

    case "ADSDocumentsPageControl":
    case "ADSClusterPageControl":
      height = maxHeight - appBarHeight;
      break;

    case "DocumentTree":
    case "ClusterTree":
      height = maxHeight - appBarHeight - toolbarHeight - filterToolbarHeight;
      break;

    case "DocumentForm":
    case "OrganisationForm":
    case "ElasticNodeForm":
    case "ClusterForm":
      height = maxHeight - appBarHeight - toolbarHeight;
      break;

    case "ClusterApiGrid":
      height = 267;
      break;

    case "ClusterOrganisationGrid":
      height = maxHeight - appBarHeight - toolbarHeight - 10;
      break;

    case "ClusterOrganisationGridError":
      height = maxHeight - appBarHeight - toolbarHeight - 66;
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

    case "ADSDocumentsPageControl":
    case "ADSClusterPageControl":
      return {
        overflowY: "auto",
        width: "100%",
        height: `${height}px`,
        backgroundColor: adsMidGreyA10,
        pl: `${navBarWidth - 9}px`,
      };

    case "DocumentTree":
    case "ClusterTree":
      return {
        overflowY: "auto",
        width: "100%",
        height: `${height}px`,
      };

    case "ClusterApiGrid":
    case "ClusterOrganisationGrid":
      return {
        overflowY: "auto",
        width: "100%",
        height: `${height}px`,
        backgroundColor: adsOffWhite,
        pl: "12px",
        "& .idox-data-grid-header": { backgroundColor: adsLightBlue10, color: adsMidGreyA },
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

/**
 * The styling used for grid rows.
 */
export const gridRowStyle = {
  root: {
    fontFamily: "Nunito sans",
    fontSize: "15px",
    color: adsDarkGrey,
    "& .valid-row": {
      "&:hover": {
        backgroundColor: adsPaleBlueA,
        color: adsBlueA,
        cursor: "pointer",
      },
    },
    "& .invalid-row": {
      backgroundColor: adsRed10,
      color: adsBlueA,
      boxShadow: `inset 4px 0px 0px 0px ${adsRed}`,
      "&:hover": {
        backgroundColor: adsRed20,
        color: adsBlueA,
        boxShadow: `inset 4px 0px 0px 0px ${adsRed}`,
        cursor: "pointer",
      },
    },
  },
};

/**
 * Style used for delete confirmation dialog content box
 */
export const deleteDialogContentStyle = {
  maxHeight: maxContentHeight,
  fontSize: "16px",
  color: adsMidGreyA,
  lineHeight: "22px",
};

/**
 * Style used for dialog titles
 */
export const dialogTitleStyle = {
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderBottomColor: adsLightGreyC,
  mb: "8px",
};

/**
 * Style used for the text in dialog titles.
 */
export const dialogTitleTextStyle = {
  fontSize: "20px",
  fontWeight: 600,
};

/**
 * Returns the styling to be used for the save button.
 *
 * @param {boolean} hasErrors True if there are errors for the street/property; otherwise false.
 * @returns {object} The styling used for save buttons.
 */
export const getSaveButtonStyle = (hasErrors: boolean): object => {
  if (hasErrors)
    return {
      backgroundColor: adsRed,
      fontSize: "15px",
      color: adsWhite,
      height: "28px",
      pl: "6px",
      "&:hover": {
        backgroundColor: adsDarkRed,
        color: adsWhite,
      },
      "&:disabled": {
        backgroundColor: adsLightGreyB,
        color: adsWhite,
      },
    };
  else
    return {
      backgroundColor: adsBlueA,
      fontSize: "15px",
      color: adsWhite,
      height: "28px",
      pl: "6px",
      "&:hover": {
        backgroundColor: adsLightBlue,
        color: adsWhite,
      },
      "&:disabled": {
        backgroundColor: adsLightGreyB,
        color: adsWhite,
      },
    };
};

/**
 * The styling used for menus.
 */
export const menuStyle = {
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: adsLightGreyB,
  boxShadow: `4px 4px 7px ${adsLightGreyA50}`,
  borderRadius: "3px",
  minWidth: "188px",
};

/**
 * Returns the styling to be used by menu items.
 *
 * @param {boolean} hasDivider True if the item has a divider; otherwise false.
 * @return {object} The styling used for menu items.
 */
export const menuItemStyle = (hasDivider: boolean): object => {
  if (hasDivider)
    return {
      pb: "8px",
      "&:hover": {
        backgroundColor: adsPaleBlueA,
        color: adsBlueA,
      },
    };
  else
    return {
      "&:hover": {
        backgroundColor: adsPaleBlueA,
        color: adsBlueA,
      },
    };
};

/**
 * Return the styling for the clear search icon
 *
 * @param {string} text The current search string
 * @return {object} The styling to be used for the clear search icon.
 */
export function ClearSearchIconStyle(text: string): object {
  if (text && text.length > 0)
    return {
      color: adsMidGreyA,
      "&:hover": {
        color: adsBlueA,
      },
    };
  else
    return {
      display: "none",
    };
}
