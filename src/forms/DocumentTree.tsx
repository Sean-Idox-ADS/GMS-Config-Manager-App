//#region header */
/**************************************************************************************************
//
//  Description: Tree to display the MT document data.
//
//  Copyright:    © 2025 Idox Software Limited
//
//--------------------------------------------------------------------------------------------------
//
//  Modification History:
//
//  Version Date     Modifier             Issue# Description
//#region Version 1.0.0.0 changes
//    001   25.02.25 Sean Flook          GMSCM-1 Initial Revision.
//#endregion Version 1.0.0.0 changes
//
//--------------------------------------------------------------------------------------------------
//#endregion header */

import React, { ChangeEvent, Fragment, SyntheticEvent, useContext, useEffect, useState } from "react";

import UserContext from "../context/UserContext";
import ConfigContext from "../context/ConfigContext";

import ConfigDocument from "../models/configDocumentType";

import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { Box, IconButton, InputAdornment, Menu, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";

import { ExpandMore, ChevronRight } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import HubIcon from "@mui/icons-material/Hub";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import ClearIcon from "@mui/icons-material/Clear";

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
import { useTheme } from "@mui/material/styles";
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

interface DocumentTreeProps {
  data: ConfigDocument[];
  selectedItem: string | undefined;
  expanded: string[];
  haveErrors: boolean;
  errorIds: string[];
  onItemSelected: (id: string | undefined) => void;
  onAddItem: (type: string, id?: string | undefined) => void;
  onDeleteItem: (type: string, id: string) => void;
  onExpandedItemsChange: (nodeIds: string[]) => void;
}

const DocumentTree: React.FC<DocumentTreeProps> = ({
  data,
  selectedItem,
  expanded,
  haveErrors,
  errorIds,
  onItemSelected,
  onAddItem,
  onDeleteItem,
  onExpandedItemsChange,
}) => {
  const theme = useTheme();

  const userContext = useContext(UserContext);
  const configContext = useContext(ConfigContext);

  const [expandAll, setExpandAll] = useState<string>("Expand all");
  const [filterBy, setFilterBy] = useState<string>("");
  const [filteredData, setFilteredData] = useState<ConfigDocument[]>(data);

  const [hoverId, setHoverId] = useState<string | undefined>(undefined);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  /**
   * Event to handle when the expand all button is clicked.
   */
  const handleExpandAll = () => {
    const expandList: string[] = [];
    data.forEach((doc) => {
      expandList.push(doc.id);
      doc.organisations.forEach((org) => {
        expandList.push(`${doc.id}|${org.organisationName}`);
        org.elasticNodes.forEach((node) => {
          expandList.push(`${doc.id}|${org.organisationName}|${node}`);
        });
      });
    });
    if (onExpandedItemsChange) onExpandedItemsChange(expandAll === "Expand all" ? expandList : []);
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
      const filteredList: ConfigDocument[] = data.filter((doc) =>
        doc.name.toLowerCase().includes(newValue.toLowerCase())
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
   * Event to handle when the configuration menu is clicked.
   *
   * @param event The event object.
   */
  const handleConfigurationMenuClick = (event: SyntheticEvent<HTMLElement | null>) => {
    setAnchorEl(event.nativeEvent.target as HTMLElement);
  };

  /**
   * Event to handle when the configuration menu is closed.
   *
   * @param event The event object.
   */
  const handleConfigurationMenuClose = (event: SyntheticEvent) => {
    setAnchorEl(null);
    event.stopPropagation();
  };

  /**
   * Event to handle when the add configuration menu item is clicked.
   *
   * @param event The event object.
   */
  const handleAddConfigurationClick = (event: SyntheticEvent): void => {
    handleConfigurationMenuClose(event);
    if (onAddItem) onAddItem("configuration");
  };

  /**
   * Event to handle when the add organisation menu item is clicked.
   *
   * @param event The event object.
   * */
  const handleAddOrganisationClick = (event: SyntheticEvent): void => {
    handleConfigurationMenuClose(event);
    if (onAddItem) onAddItem("organisation", hoverId ?? "");
  };

  /**
   * Event to handle when the delete organisation menu item is clicked.
   *
   * @param event The event object.
   */
  const handleDeleteOrganisationClick = (event: SyntheticEvent): void => {
    handleConfigurationMenuClose(event);
    if (onDeleteItem) onDeleteItem("organisation", hoverId ?? "");
  };

  /**
   * Event to handle when the add elastic node menu item is clicked.
   *
   * @param event The event object.
   */
  const handleAddElasticNodeClick = (event: SyntheticEvent): void => {
    handleConfigurationMenuClose(event);
    if (onAddItem) onAddItem("elasticNode", hoverId ?? "");
  };

  /**
   * Event to handle when the delete elastic node menu item is clicked.
   *
   * @param event The event object.
   */
  const handleDeleteElasticNodeClick = (event: SyntheticEvent): void => {
    handleConfigurationMenuClose(event);
    if (onDeleteItem) onDeleteItem("elasticNode", hoverId ?? "");
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
    if (iconClicked && onExpandedItemsChange) {
      onExpandedItemsChange(nodeIds);
    }
  }

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
    const currentDocument = id === selectedItem;
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
    else if (currentDocument)
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
    if (configContext.clearFilter) {
      setFilterBy("");
      setFilteredData(data);
      configContext.onClearFilter(false);
    }
  }, [configContext, data]);

  return (
    <Fragment>
      <Box sx={toolbarStyle} id="ads-document-tree-toolbar">
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
          } Multi-tenant configurations`}</Typography>
          <Stack direction="row" alignItems="center" justifyContent={"flex-end"} spacing={1}>
            <Tooltip title={`${expandAll} items in list`} arrow placement="right" sx={tooltipStyle}>
              <IconButton onClick={handleExpandAll} sx={ActionIconStyle()} aria-controls="expand-collapse" size="small">
                {expandAll === "Expand all" ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                <Typography variant="body2">{expandAll}</Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Actions" arrow placement="right" sx={tooltipStyle}>
              <IconButton
                onClick={handleConfigurationMenuClick}
                aria-controls="configuration_action-menu"
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
              onClose={handleConfigurationMenuClose}
              sx={menuStyle}
            >
              {userContext.currentUser?.isSuperAdministrator && (
                <MenuItem dense onClick={handleAddConfigurationClick} sx={menuItemStyle(false)}>
                  <Typography variant="inherit">Add configuration</Typography>
                </MenuItem>
              )}
            </Menu>
          </Stack>
        </Stack>
      </Box>
      <Box sx={filterToolbarStyle} id="ads-document-tree-filter-toolbar">
        <TextField
          id="configuration-filter"
          label="Filter by configuration name"
          sx={FormInputStyle(false)}
          variant="outlined"
          fullWidth
          margin="dense"
          size="small"
          value={filterBy}
          onChange={handleFilterChange}
          placeholder="Filter by configuration name"
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
      <Box sx={dataFormStyle("DocumentTree")}>
        <SimpleTreeView
          aria-label="document tree"
          id="document-tree"
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
                  key={`document-${rec.id}-${index}`}
                  itemId={`${rec.id}`}
                  sx={treeItemStyle(rec.id, haveErrors && errorIds.includes(rec.id))}
                  label={
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                      <Stack direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={1}>
                        <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                          <DescriptionOutlinedIcon />
                          <Typography variant="subtitle2">{rec.name}</Typography>
                        </Stack>
                      </Stack>
                      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                        {rec.id === hoverId && (
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
                >
                  {rec.organisations.map((recOrg, orgIndex) => {
                    return (
                      <TreeItem
                        key={`document-${rec.id}-${index}-organisation-${recOrg.organisationName}-${orgIndex}`}
                        itemId={`${rec.id}|${recOrg.organisationName}`}
                        sx={treeItemStyle(
                          `${rec.id}|${recOrg.organisationName}`,
                          haveErrors && errorIds.includes(recOrg.organisationName)
                        )}
                        label={
                          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                              <CorporateFareIcon />
                              <Typography variant="caption">{recOrg.organisationName}</Typography>
                            </Stack>
                            {`${rec.id}|${recOrg.organisationName}` === hoverId && (
                              <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                                <IconButton
                                  onClick={handleDeleteOrganisationClick}
                                  size="small"
                                  title="Delete organisation"
                                  aria-label="Delete organisation"
                                >
                                  <DeleteIcon sx={ActionIconStyle()} />
                                </IconButton>
                                <IconButton
                                  onClick={handleAddElasticNodeClick}
                                  size="small"
                                  title="Add elastic node"
                                  aria-label="Add elastic node"
                                >
                                  <AddIcon sx={ActionIconStyle()} />
                                </IconButton>
                              </Stack>
                            )}
                          </Stack>
                        }
                        onMouseEnter={() => handleMouseEnterTreeItem(`${rec.id}|${recOrg.organisationName}`)}
                        onMouseLeave={handleMouseLeaveTreeItem}
                      >
                        {recOrg.elasticNodes.map((recNode, nodeIndex) => {
                          return (
                            <TreeItem
                              key={`document-${rec.id}-${index}-organisation-${recOrg.organisationName}-${orgIndex}-elastic-node-${recNode}-${nodeIndex}`}
                              itemId={`${rec.id}|${recOrg.organisationName}|${recNode}`}
                              sx={treeItemStyle(
                                `${rec.id}|${recOrg.organisationName}|${recNode}`,
                                haveErrors && errorIds.includes(recNode)
                              )}
                              label={
                                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                  <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                                    <HubIcon />
                                    <Typography variant="caption">{recNode}</Typography>
                                  </Stack>
                                  {`${rec.id}|${recOrg.organisationName}|${recNode}` === hoverId && (
                                    <IconButton
                                      onClick={handleDeleteElasticNodeClick}
                                      size="small"
                                      title="Delete elastic node"
                                      aria-label="Delete elastic node"
                                    >
                                      <DeleteIcon sx={ActionIconStyle()} />
                                    </IconButton>
                                  )}
                                </Stack>
                              }
                              onMouseEnter={() =>
                                handleMouseEnterTreeItem(`${rec.id}|${recOrg.organisationName}|${recNode}`)
                              }
                              onMouseLeave={handleMouseLeaveTreeItem}
                            />
                          );
                        })}
                      </TreeItem>
                    );
                  })}
                </TreeItem>
              );
            })}
        </SimpleTreeView>
      </Box>
    </Fragment>
  );
};

export default DocumentTree;
