// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Cluster API form
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

import { UserApis } from "../dtos/multiTenantClusterDto";
import ApiGridType from "../models/apiGridType";
import ClusterErrorType from "../models/clusterErrorType";

import { Box, Grid2, Link, Stack, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridRenderCellParams, GridRowId, GridRowParams } from "@mui/x-data-grid";
import ADSActionButton, { ADSActionButtonVariant } from "../components/ADSActionButton";

import EditDialog, { EditVariant } from "../dialogs/EditDialog";

import { dataFormStyle, FormRowStyle, gridRowStyle } from "../utils/ADSStyles";
import { createTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { adsRed } from "../utils/ADSColour";

interface ClusterApiFormProps {
  data: UserApis;
  errors: ClusterErrorType[] | undefined;
  onDataChange: (data: UserApis) => void;
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) => {
    return gridRowStyle;
  },
  { defaultTheme }
);

const ClusterApiForm: React.FC<ClusterApiFormProps> = ({ data, errors, onDataChange }) => {
  const classes = useStyles();

  const userContext = useContext(UserContext);

  const [apiGridData, setApiGridData] = useState<ApiGridType[]>([]);

  const [selectedApiRow, setSelectedApiRow] = useState<number | undefined>(undefined);

  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const editApiData = useRef<ApiGridType>(undefined);

  /**
   * Method to update the data.
   * @param fieldName The field name to update.
   * @param value The new value.
   */
  const updateData = (fieldName: string, value: string | undefined): void => {
    const updatedApi = {
      ...data,
      [fieldName]: value,
    };

    if (onDataChange) {
      onDataChange(updatedApi);
    }
  };

  /**
   * Method to display the action buttons for the given api row.
   *
   * @param params The grid row parameters.
   * @returns {ReactElement} The action buttons for the row
   */
  const displayApiActionButtons = (params: GridRowParams<ApiGridType>): ReactElement => {
    const onEditClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation();
      editApiData.current = params.row;
      setOpenEditDialog(true);
    };

    return userContext.currentUser?.isSuperAdministrator &&
      selectedApiRow !== undefined &&
      params.id === selectedApiRow ? (
      <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
        <GridActionsCellItem
          icon={
            <ADSActionButton
              id={`edit-api-${params.id}`}
              variant={ADSActionButtonVariant.edit}
              inheritBackground
              tooltipTitle={`Edit ${params.row.name}`}
              tooltipPlacement="bottom"
              onClick={onEditClick}
            />
          }
          label="Delete"
          onClick={onEditClick}
        />
      </Stack>
    ) : (
      <></>
    );
  };

  /**
   * Method to display the URL as a link.
   *
   * @param params The parameters for the cell
   * @returns {ReactElement} The Link for the given URL.
   */
  function renderUrl(params: GridRenderCellParams<any, string, any>): ReactElement {
    const url: string = params.value ?? "";

    const urlError: ClusterErrorType[] = errors?.filter((x) => x.field === params.row.name.toLowerCase()) ?? [];

    return (
      <>
        {urlError.length === 0 ? (
          <Link href={url} target="_blank" rel="noopener" underline="hover">
            {url}
          </Link>
        ) : (
          <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
            {url && (
              <Link href={url} target="_blank" rel="noopener" underline="hover">
                {url}
              </Link>
            )}
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "14px", color: adsRed }}>
              {urlError.map((error) => error.errors).join(", ")}
            </Typography>
          </Stack>
        )}
      </>
    );
  }

  /**
   * The definition of the columns used in the API grid.
   */
  const apiColumns = [
    { field: "id" },
    {
      field: "name",
      headerClassName: "idox-data-grid-header",
      headerName: "API",
      flex: 20,
    },
    {
      field: "url",
      headerClassName: "idox-data-grid-header",
      headerName: "URL",
      flex: 80,
      renderCell: renderUrl,
    },
    {
      field: "",
      headerClassName: "idox-data-grid-header",
      flex: 2,
      sortable: false,
      type: "actions" as const,
      getActions: (params: GridRowParams<ApiGridType>) => [displayApiActionButtons(params)],
    },
  ];

  /**
   * Event to handle when the mouse enters an API row in the data grid.
   *
   * @param event The event object.
   */
  const handleApiRowMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    setSelectedApiRow(Number(event.currentTarget.getAttribute("data-id")));
  };

  /**
   * Event to handle when the mouse leaves am API row in the data grid.
   */
  const handleApiRowMouseLeave = () => {
    setSelectedApiRow(undefined);
  };

  /**
   * Method to handle the edit API done event.
   *
   * @param {ApiGridType} data The new API data.
   */
  const handleEditApiDone = (data: ApiGridType): void => {
    updateData(data.name, data.url);
    setOpenEditDialog(false);
  };

  /**
   * Method to handle the edit API close event.
   *
   */
  const handleEditApiClose = (): void => {
    setOpenEditDialog(false);
  };

  /**
   * Method to determine if the row is invalid.
   *
   * @param {GridRowId} id The row id.
   * @returns {boolean} True if the row is invalid; otherwise false
   */
  const isRowInvalid = (id: GridRowId): boolean => {
    if (errors && errors.length > 0) {
      let rowErrors: ClusterErrorType[] = [];
      switch (id.toString()) {
        case "0":
          rowErrors = errors.filter((x) => x.field === "imanage");
          break;

        case "1":
          rowErrors = errors.filter((x) => x.field === "settings");
          break;

        case "2":
          rowErrors = errors.filter((x) => x.field === "lookups");
          break;

        default:
          break;
      }
      return rowErrors && rowErrors.length > 0;
    } else return false;
  };

  useEffect(() => {
    if (data) {
      const gridApiData: ApiGridType[] = [
        { id: 0, name: "iManage", url: data.iManage },
        { id: 1, name: "Settings", url: data.Settings },
        { id: 2, name: "Lookups", url: data.Lookups },
      ];
      setApiGridData(gridApiData);
    }
  }, [data]);

  return (
    <>
      <Box sx={dataFormStyle("ClusterForm")}>
        <Grid2 container justifyContent="flex-start" alignItems="baseline" sx={FormRowStyle()} rowSpacing={2}>
          <Grid2 size={12}>
            <Box sx={dataFormStyle("ClusterApiGrid")} className={classes.root}>
              <DataGrid
                rows={apiGridData}
                columns={apiColumns}
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
                    onMouseEnter: handleApiRowMouseEnter,
                    onMouseLeave: handleApiRowMouseLeave,
                  },
                }}
                getRowClassName={(params) => `${isRowInvalid(params.id) ? "invalid-row" : "valid-row"}`}
              />
            </Box>
          </Grid2>
        </Grid2>
      </Box>
      <EditDialog
        open={openEditDialog}
        variant={EditVariant.api}
        data={editApiData.current}
        onDone={handleEditApiDone}
        onClose={handleEditApiClose}
      />
    </>
  );
};

export default ClusterApiForm;
