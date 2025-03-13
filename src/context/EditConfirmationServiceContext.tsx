// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Edit Confirmation Service Context
//
//  Copyright:    © 2025 Idox Software Limited.
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
// region Version 1.0.0.0
//    001   12.03.25 Sean Flook          GMSCM-1 Initial Revision.
// endregion Version 1.0.0.0
//
//--------------------------------------------------------------------------------------------------
// endregion header

import { createContext, Fragment, ReactNode, useContext, useRef, useState } from "react";
import ConfirmEditLossDialog from "../dialogs/ConfirmEditLossDialog";

const EditConfirmationServiceContext = createContext<any>({} as any);

export const useEditConfirmation = () => useContext(EditConfirmationServiceContext);

/**
 * Component to provide the configuration context.
 */
type EditConfirmationServiceProviderProps = {
  children?: ReactNode;
};

export const EditConfirmationServiceProvider = ({ children }: EditConfirmationServiceProviderProps) => {
  const [confirmationState, setConfirmationState] = useState<boolean>(false);
  const [associatedRecords, setAssociatedRecords] = useState<string[]>([]);

  const awaitingPromiseRef = useRef<any | undefined>(undefined);

  /**
   * Method to handle when the confirmation is accepted.
   */
  const openConfirmation = (options: any) => {
    if (options.constructor === Array) {
      // if (process.env.NODE_ENV === "development")
      setAssociatedRecords(options);
      setConfirmationState(true);
    } else setConfirmationState(options);
    return new Promise((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  };

  /**
   * Method to handle when the confirmation is accepted.
   */
  const handleCancelMoveAway = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }

    setConfirmationState(false);
  };

  /**
   * Method to handle when the confirmation is accepted.
   */
  const handleSaveChanges = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve("save");
    }

    setConfirmationState(false);
  };

  /**
   * Method to handle when the confirmation is accepted.
   */
  const handleAllowDispose = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve("discard");
    }

    setConfirmationState(false);
  };

  return (
    <Fragment>
      <EditConfirmationServiceContext.Provider value={openConfirmation} children={children} />

      <ConfirmEditLossDialog
        isOpen={confirmationState}
        title="Unsaved changes"
        message={
          associatedRecords && associatedRecords.length > 0
            ? "You have made changes to these record types, do you want to keep them or discard them?"
            : "You have made changes to this record, do you want to keep them or discard them?"
        }
        saveText="Keep"
        associatedRecords={associatedRecords}
        handleSaveClick={handleSaveChanges}
        handleDisposeClick={handleAllowDispose}
        handleReturnClick={handleCancelMoveAway}
      />
    </Fragment>
  );
};
