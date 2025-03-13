// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Cluster Organisation Form
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

import React, { ReactElement, useContext, useEffect, useRef, useState } from "react";

import UserContext from "../context/UserContext";

import ClusterErrorType from "../models/clusterErrorType";
import OrganisationGridType from "../models/organisationGridType";

import { Box, Grid2, Stack } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridRowId, GridRowParams } from "@mui/x-data-grid";
import ConfirmDeleteDialog, { DeleteVariant } from "../dialogs/ConfirmDeleteDialog";
import ADSActionButton, { ADSActionButtonVariant } from "../components/ADSActionButton";

import { dataFormStyle, FormRowStyle, gridRowStyle } from "../utils/ADSStyles";
import { createTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import ADSErrorDisplay from "../components/ADSErrorDisplay";

interface ClusterOrganisationFormProps {
  data: string[] | undefined;
  errors: ClusterErrorType[] | undefined;
  onDeleteOrganisationRecord: (name: string) => void;
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) => {
    return gridRowStyle;
  },
  { defaultTheme }
);

const ClusterOrganisationForm: React.FC<ClusterOrganisationFormProps> = ({
  data,
  errors,
  onDeleteOrganisationRecord,
}) => {
  const classes = useStyles();

  const userContext = useContext(UserContext);

  const [organisationGridData, setOrganisationGridData] = useState<OrganisationGridType[]>([]);
  const [selectedOrgRow, setSelectedOrgRow] = useState<number | undefined>(undefined);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState<boolean>(false);
  const [organisationErrors, setOrganisationErrors] = useState<ClusterErrorType[] | undefined>(undefined);

  const deleteOrgId = useRef<GridRowId | undefined>(undefined);
  const deleteType = useRef<DeleteVariant | undefined>(undefined);
  const deleteRecordName = useRef<string | undefined>(undefined);

  /**
   * Method to display the action buttons for the given organisation row.
   *
   * @param params The grid row parameters.
   * @returns {ReactElement} The action buttons for the row
   */
  const displayOrgActionButtons = (params: GridRowParams<OrganisationGridType>): ReactElement => {
    const onDeleteClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation();
      deleteOrgId.current = params.id;
      deleteType.current = DeleteVariant.organisation;
      deleteRecordName.current = params.row.organisation;
      setOpenDeleteConfirmation(true);
    };

    return userContext.currentUser?.isSuperAdministrator &&
      selectedOrgRow !== undefined &&
      params.id === selectedOrgRow ? (
      <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
        <GridActionsCellItem
          icon={
            <ADSActionButton
              id={`delete-organisation-${params.id}`}
              variant={ADSActionButtonVariant.delete}
              inheritBackground
              tooltipTitle={`Delete ${params.row.organisation}`}
              tooltipPlacement="bottom"
              onClick={onDeleteClick}
            />
          }
          label="Delete"
          onClick={onDeleteClick}
        />
      </Stack>
    ) : (
      <></>
    );
  };

  /**
   * The definition of the columns used in the organisation grid.
   */
  const organisationColumns = [
    { field: "id" },
    {
      field: "organisation",
      headerClassName: "idox-data-grid-header",
      headerName: "Organisation",
      flex: 100,
    },
    {
      field: "",
      headerClassName: "idox-data-grid-header",
      flex: 2,
      sortable: false,
      type: "actions" as const,
      getActions: (params: GridRowParams<OrganisationGridType>) => [displayOrgActionButtons(params)],
    },
  ];

  /**
   * Event to handle when the mouse enters an organisation row in the data grid.
   *
   * @param event The event object.
   */
  const handleOrgRowMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    setSelectedOrgRow(Number(event.currentTarget.getAttribute("data-id")));
  };

  /**
   * Event to handle when the mouse leaves am organisation row in the data grid.
   */
  const handleOrgRowMouseLeave = () => {
    setSelectedOrgRow(undefined);
  };

  /**
   * Event to handle when the delete confirmation dialog is closed.
   *
   * @param {boolean} deleteConfirmed True if the user has confirmed the delete; otherwise false.
   */
  const handleCloseDeleteConfirmation = (deleteConfirmed: boolean): void => {
    setOpenDeleteConfirmation(false);

    if (deleteConfirmed) {
      if (deleteOrgId.current !== undefined) {
        const deleteRecord: OrganisationGridType | undefined = organisationGridData.find(
          (x) => x.id === deleteOrgId.current
        );
        if (deleteRecord && onDeleteOrganisationRecord) {
          onDeleteOrganisationRecord(deleteRecord.organisation);
        }
      }
    }

    deleteType.current = undefined;
  };

  useEffect(() => {
    if (data) {
      const gridOrgData: OrganisationGridType[] = data
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
        .map((x, index) => {
          return { id: index, organisation: x };
        });
      setOrganisationGridData(gridOrgData);
    }
  }, [data]);

  useEffect(() => {
    if (errors && errors.length > 0) setOrganisationErrors(errors?.filter((x) => x.field === "organisation"));
    else setOrganisationErrors(undefined);
  }, [errors]);

  return (
    <>
      <Box sx={dataFormStyle("ClusterForm")}>
        <Grid2 container justifyContent="flex-start" alignItems="baseline" sx={FormRowStyle()} rowSpacing={2}>
          {organisationErrors && organisationErrors.length > 0 && (
            <Grid2 size={12}>
              <ADSErrorDisplay
                errorText={organisationErrors.map((x) => x.errors).join(", ")}
                id="cluster-organisation-grid-error"
              />
            </Grid2>
          )}
          <Grid2 size={12}>
            <Box
              sx={dataFormStyle(
                `${
                  organisationErrors && organisationErrors.length > 0
                    ? "ClusterOrganisationGridError"
                    : "ClusterOrganisationGrid"
                }`
              )}
              className={classes.root}
            >
              <DataGrid
                rows={organisationGridData}
                columns={organisationColumns}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      id: false,
                    },
                  },
                }}
                autoPageSize
                disableColumnMenu
                disableRowSelectionOnClick
                pagination
                slotProps={{
                  row: {
                    onMouseEnter: handleOrgRowMouseEnter,
                    onMouseLeave: handleOrgRowMouseLeave,
                  },
                }}
              />
            </Box>
          </Grid2>
        </Grid2>
      </Box>
      {deleteType.current !== undefined && (
        <ConfirmDeleteDialog
          variant={deleteType.current}
          open={openDeleteConfirmation}
          recordName={deleteRecordName.current}
          onClose={handleCloseDeleteConfirmation}
        />
      )}
    </>
  );
};

export default ClusterOrganisationForm;
