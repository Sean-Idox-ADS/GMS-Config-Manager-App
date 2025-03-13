// region header
//--------------------------------------------------------------------------------------------------
//
//  Description: Cluster Tree
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

import React, { ChangeEvent, Fragment, SyntheticEvent, useContext, useEffect, useState } from "react";

import UserContext from "../context/UserContext";
import ClusterContext from "../context/ClusterContext";

import MultiTenantClusterGetDto from "../dtos/multiTenantClusterDto";

import { Box, IconButton, InputAdornment, Menu, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";

import { ExpandMore, ChevronRight } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

import {
  adsBlack0,
  adsBlueA,
  adsDarkRed,
  adsLightGreyB,
  adsLightGreyD,
  adsPaleBlueA,
  adsRed,
  adsRed10,
  adsRed20,
} from "../utils/ADSColour";
import {
  ActionIconStyle,
  ClearSearchIconStyle,
  dataFormStyle,
  filterToolbarStyle,
  FormInputStyle,
  menuItemStyle,
  menuStyle,
  toolbarStyle,
  tooltipStyle,
} from "../utils/ADSStyles";
import { useTheme } from "@mui/material/styles";

interface ClusterTreeProps {
  data: MultiTenantClusterGetDto[];
  selectedItem: string | undefined;
  haveErrors: boolean;
  errorIds: string[];
  onItemSelected: (id: string | undefined) => void;
  onAddItem: (type: string, id?: string | undefined) => void;
}

const ClusterTree: React.FC<ClusterTreeProps> = ({
  data,
  selectedItem,
  haveErrors,
  errorIds,
  onItemSelected,
  onAddItem,
}) => {
  const theme = useTheme();

  const userContext = useContext(UserContext);
  const clusterContext = useContext(ClusterContext);

  const [expandAll, setExpandAll] = useState<string>("Expand all");
  const [expanded, setExpanded] = useState<string[]>([]);

  const [filterBy, setFilterBy] = useState<string>("");
  const [filteredData, setFilteredData] = useState<MultiTenantClusterGetDto[]>(data);

  const [hoverId, setHoverId] = useState<string | undefined>(undefined);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  /**
   * Event to handle when the expand all button is clicked.
   */
  const handleExpandAll = () => {
    const expandList: string[] = [];
    data.forEach((cluster) => {
      expandList.push(cluster.id);
    });
    setExpanded(expandAll === "Expand all" ? expandList : []);
    setExpandAll((oldExpandAll) => (oldExpandAll === "Expand all" ? "Collapse all" : "Expand all"));
  };

  /**
   * Event to handle when the filter changes.
   *
   * @param newValue The new value to filter by.
   */
  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value;
    setFilterBy(newValue);
    if (newValue.length > 0) {
      const filteredList: MultiTenantClusterGetDto[] = data.filter((cluster) =>
        cluster.name.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredData(filteredList);
      const foundCurrent = filteredList.find((doc) => doc.id === selectedItem);
      if (!foundCurrent && onItemSelected) onItemSelected(undefined);
    } else {
      setFilteredData(data);
    }
  };

  /**
   * Event to handle when the clear search button is clicked.
   */
  const handleClearSearch = (): void => {
    setFilterBy("");
    setFilteredData(data);
  };

  /**
   * Event to handle when the cluster menu is clicked.
   *
   * @param event The event object.
   */
  const handleClusterMenuClick = (event: SyntheticEvent<HTMLElement | null>) => {
    setAnchorEl(event.nativeEvent.target as HTMLElement);
  };

  /**
   * Event to handle when the cluster menu is closed.
   *
   * @param event The event object.
   */
  const handleClusterMenuClose = (event: SyntheticEvent) => {
    setAnchorEl(null);
    event.stopPropagation();
  };

  /**
   * Event to handle when the add cluster menu item is clicked.
   *
   * @param event The event object.
   */
  const handleAddClusterClick = (event: SyntheticEvent): void => {
    handleClusterMenuClose(event);
    if (onAddItem) onAddItem("cluster");
  };

  /**
   * Event to handle when a node is selected.
   *
   * @param {object} event The event object.
   * @param {number} nodeId The id of the selected node.
   */
  function handleNodeSelected(event: SyntheticEvent, itemIds: string | null) {
    event.stopPropagation();
    if (onItemSelected) onItemSelected(itemIds ?? undefined);
  }

  /**
   * Event to handle the toggling of the nodes.
   *
   * @param {object} event The event object.
   * @param {array} nodeIds The list of node ids that are expanded.
   */
  function handleNodeToggle(event: SyntheticEvent, nodeIds: string[]): void {
    event.stopPropagation();
    const iconClicked = (event.target as HTMLElement).closest(".MuiTreeItem-iconContainer");
    if (iconClicked) {
      setExpanded(nodeIds);
    }
  }

  /**
   * Event to handle when the add organisation menu item is clicked.
   *
   * @param event The event object.
   * */
  const handleAddOrganisationClick = (event: SyntheticEvent): void => {
    if (onAddItem) onAddItem("organisation", hoverId ?? "");
  };

  /**
   * Event to handle when the mouse enters a configuration item.
   *
   * @param {string} recId
   */
  const handleMouseEnterTreeItem = (recId: string): void => {
    setHoverId(recId);
  };

  /**
   * Event to handle when the mouse leaves a configuration item.
   */
  const handleMouseLeaveTreeItem = (): void => {
    setHoverId(undefined);
  };

  /**
   * Method to get styling used for a tree item, based on whether usrn is current street and/or checked.
   *
   * @param {string} id The id for the document
   * @returns {object} The styling for the tree item.
   */
  const treeItemStyle = (id: string, hasError: boolean): object => {
    const currentCluster = id === selectedItem;
    if (hasError)
      return {
        backgroundColor: adsRed10,
        color: adsRed,
        borderTop: `solid ${adsLightGreyB} 1px`,
        borderLeft: `solid ${adsLightGreyD} 5px`,
        pb: theme.spacing(1),
        pt: theme.spacing(1),
        "&:hover": {
          backgroundColor: adsRed20,
          color: adsDarkRed,
        },
      };
    else if (currentCluster)
      return {
        backgroundColor: adsPaleBlueA,
        borderTop: `solid ${adsLightGreyB} 1px`,
        borderLeft: `solid ${adsLightGreyD} 5px`,
        pb: theme.spacing(1),
        pt: theme.spacing(1),
        "&:hover": {
          backgroundColor: adsPaleBlueA,
          color: adsBlueA,
        },
      };
    else
      return {
        backgroundColor: "inherit",
        borderTop: `solid ${adsLightGreyB} 1px`,
        borderLeft: `solid ${adsBlack0} 5px`,
        pb: theme.spacing(1),
        pt: theme.spacing(1),
        "&:hover": {
          backgroundColor: adsPaleBlueA,
          color: adsBlueA,
        },
      };
  };

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    if (clusterContext.clearFilter) {
      setFilterBy("");
      setFilteredData(data);
      clusterContext.onClearFilter(false);
    }
  }, [clusterContext, data]);

  return (
    <Fragment>
      <Box sx={toolbarStyle} id="ads-cluster-tree-toolbar">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: "12px", pr: "12px", pt: "4px" }}
        >
          <Typography variant="body2">{`${
            data.length === filteredData.length
              ? data.length
              : filteredData.length.toString() + " of " + data.length.toString()
          } Multi-tenant clusters`}</Typography>
          <Stack direction="row" alignItems="center" justifyContent={"flex-end"} spacing={1}>
            <Tooltip title={`${expandAll} items in list`} arrow placement="right" sx={tooltipStyle}>
              <IconButton onClick={handleExpandAll} sx={ActionIconStyle()} aria-controls="expand-collapse" size="small">
                {expandAll === "Expand all" ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                <Typography variant="body2">{expandAll}</Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Actions" arrow placement="right" sx={tooltipStyle}>
              <IconButton
                onClick={handleClusterMenuClick}
                aria-controls="cluster_action-menu"
                aria-haspopup="true"
                size="small"
              >
                <MoreVertIcon sx={ActionIconStyle()} />
              </IconButton>
            </Tooltip>
            <Menu
              id="configuration_action-menu"
              elevation={2}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClusterMenuClose}
              sx={menuStyle}
            >
              {userContext.currentUser?.isSuperAdministrator && (
                <MenuItem dense onClick={handleAddClusterClick} sx={menuItemStyle(false)}>
                  <Typography variant="inherit">Add cluster</Typography>
                </MenuItem>
              )}
            </Menu>
          </Stack>
        </Stack>
      </Box>
      <Box sx={filterToolbarStyle} id="ads-cluster-tree-filter-toolbar">
        <TextField
          id="configuration-filter"
          label="Filter by cluster name"
          sx={FormInputStyle(false)}
          variant="outlined"
          fullWidth
          margin="dense"
          size="small"
          value={filterBy}
          onChange={handleFilterChange}
          placeholder="Filter by cluster name"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton id="btnClear" onClick={handleClearSearch} aria-label="clear button" size="small">
                    <ClearIcon sx={ClearSearchIconStyle(filterBy)} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      <Box sx={dataFormStyle("ClusterTree")}>
        <SimpleTreeView
          aria-label="cluster tree"
          id="cluster-tree"
          sx={{ flexGrow: 1, overflowY: "auto" }}
          slots={{ expandIcon: ChevronRight, collapseIcon: ExpandMore }}
          expandedItems={expanded}
          selectedItems={selectedItem}
          onSelectedItemsChange={handleNodeSelected}
          onExpandedItemsChange={handleNodeToggle}
        >
          {filteredData
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }))
            .map((rec, index) => {
              return (
                <TreeItem
                  key={`cluster-${rec.id}-${index}`}
                  itemId={`${rec.id}`}
                  sx={treeItemStyle(rec.id, haveErrors && errorIds.includes(rec.id))}
                  label={
                    <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                      <Typography variant="subtitle2">{rec.name}</Typography>
                    </Stack>
                  }
                  onMouseEnter={() => handleMouseEnterTreeItem(rec.id)}
                  onMouseLeave={handleMouseLeaveTreeItem}
                >
                  <TreeItem
                    key={`cluster-${rec.id}-${index}-user-apis`}
                    itemId={`${rec.id}|user-apis`}
                    sx={treeItemStyle(rec.id, haveErrors && errorIds.includes(rec.id))}
                    label={
                      <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                        <Typography variant="subtitle2">Apis</Typography>
                      </Stack>
                    }
                    onMouseEnter={() => handleMouseEnterTreeItem(rec.id)}
                    onMouseLeave={handleMouseLeaveTreeItem}
                  />
                  <TreeItem
                    key={`cluster-${rec.id}-${index}-organisations`}
                    itemId={`${rec.id}|organisations`}
                    sx={treeItemStyle(rec.id, haveErrors && errorIds.includes(rec.id))}
                    label={
                      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                          <Typography variant="subtitle2">Organisations</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                          {userContext.currentUser?.isSuperAdministrator && rec.id === hoverId && (
                            <IconButton
                              onClick={handleAddOrganisationClick}
                              size="small"
                              title="Add organisation"
                              aria-label="Add organisation"
                            >
                              <AddIcon sx={ActionIconStyle()} />
                            </IconButton>
                          )}
                        </Stack>
                      </Stack>
                    }
                    onMouseEnter={() => handleMouseEnterTreeItem(rec.id)}
                    onMouseLeave={handleMouseLeaveTreeItem}
                  />
                </TreeItem>
              );
            })}
        </SimpleTreeView>
      </Box>
    </Fragment>
  );
};

export default ClusterTree;
