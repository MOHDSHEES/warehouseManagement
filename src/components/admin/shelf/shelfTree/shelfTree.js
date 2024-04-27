import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Alert, Button, IconButton, Skeleton, Stack } from "@mui/material";
import AddSubShelf from "../addsubShelfModel";
import findParentShelfRecursively from "../../../functions/recursiveFunctions/findRecursive";
import updateShelvesRecursively from "@/src/components/functions/recursiveFunctions/updateRecursive";
import EditModel from "../editModel";
import SettingsIcon from "@mui/icons-material/Settings";

function LabelTable({
  shelf,
  // open,
  // setOpen,
  setShelfClicked,
  // productOpen,
  // setProductOpen,
  editModelOpen,
  setEditModelOpen,
}) {
  // function openModel() {
  //   setShelfClicked(shelf);
  //   setOpen(!open);
  // }
  function editModel() {
    setShelfClicked(shelf);
    setEditModelOpen(!editModelOpen);
  }

  // function openProductModel() {
  //   setShelfClicked(shelf);
  //   setProductOpen(!productOpen);
  // }
  return (
    <TableContainer className="shelf-table" component={Paper}>
      <Table size="small" sx={{ minWidth: 400 }}>
        <TableBody>
          <TableRow>
            <TableCell>Shelf Name: {shelf.shelfName}</TableCell>
            <TableCell>
              No. of Sub Shelves:{" "}
              {shelf.childrenShelves ? shelf.childrenShelves.length : 0}
            </TableCell>
            {/* <TableCell>
              {shelf.childrenShelves && shelf.childrenShelves.length === 0 && (
                <Button variant="text" onClick={openProductModel}>
                  Add Product
                </Button>
              )}
            </TableCell> */}
            <TableCell>
              <IconButton onClick={editModel} aria-label="settings">
                <SettingsIcon color="primary" fontSize="small" />
              </IconButton>
              {/* <Button variant="text" onClick={editModel}>
                Edit
              </Button> */}
            </TableCell>
            {/* <TableCell>
              <Button variant="text" onClick={openModel}>
                Add Sub-Shelf
              </Button>
            </TableCell> */}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const renderTreeItemsRecursively = (
  shelf,
  setShelfClicked,
  // open,
  // setOpen,
  // productOpen,
  // setProductOpen,
  editModelOpen,
  setEditModelOpen
) => {
  return (
    <TreeItem
      key={shelf._id}
      nodeId={shelf._id}
      label={
        <LabelTable
          shelf={shelf}
          setShelfClicked={setShelfClicked}
          // open={open}
          // setOpen={setOpen}
          // productOpen={productOpen}
          // setProductOpen={setProductOpen}
          editModelOpen={editModelOpen}
          setEditModelOpen={setEditModelOpen}
        />
      }
    >
      {shelf.childrenShelvesData
        ? shelf.childrenShelvesData.map((childShelf) =>
            renderTreeItemsRecursively(
              childShelf,
              setShelfClicked,
              // open,
              // setOpen,
              // productOpen,
              // setProductOpen,
              editModelOpen,
              setEditModelOpen
            )
          )
        : shelf.childrenShelves &&
          shelf.childrenShelves.length > 0 && (
            <TreeItem
              nodeId={1}
              label={<Skeleton variant="rounded" height={40} />}
            />
          )}
    </TreeItem>
  );
};

export default function ShelfTreeView({ shelfData, warehouseId }) {
  const [shelfClicked, setShelfClicked] = useState(null);
  const [allData, setAllData] = useState("loading");
  // const [open, setOpen] = React.useState(false);
  // const [productOpen, setProductOpen] = useState(false);
  const [editModelOpen, setEditModelOpen] = useState(false);

  // console.log(editModelOpen);
  useEffect(() => {
    if (shelfData) setAllData(shelfData);
  }, [shelfData]);
  // console.log(allData);
  // console.log(allData);
  // const handleClose = () => {
  //   setOpen(false);
  // };

  const handleNodeToggle = async (event, nodeIds) => {
    const nodeId = nodeIds[0];
    // const parentShelf = allData.find((shelf) => shelf._id === nodeId);
    const parentShelf = findParentShelfRecursively(nodeId, allData);

    // console.log(parentShelf);
    if (parentShelf && !parentShelf.childrenShelvesData) {
      const { data } = await axios.post("/api/shelf/findSubshelf", {
        ids: parentShelf.childrenShelves,
      });
      if (data.status === 200) {
        setAllData((prevRootShelves) => {
          return updateShelvesRecursively(prevRootShelves, nodeId, data.data);
        });
      }
    }
  };

  return (
    <>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        onNodeToggle={handleNodeToggle}
      >
        {allData === "loading" ? (
          <Stack spacing={1}>
            <Skeleton variant="rounded" height={40} />
            <Skeleton variant="rounded" height={40} />
          </Stack>
        ) : allData && allData.length === 0 ? (
          <Alert severity="info">
            It seems like no shelves have been added to this warehouse. Add
            shelves to organize your inventory efficiently.
          </Alert>
        ) : (
          allData.map((rootShelf) =>
            renderTreeItemsRecursively(
              rootShelf,
              setShelfClicked,
              // open,
              // setOpen,
              // productOpen,
              // setProductOpen,
              editModelOpen,
              setEditModelOpen
            )
          )
        )}
      </TreeView>
      <EditModel
        editModelOpen={editModelOpen}
        setEditModelOpen={setEditModelOpen}
        warehouseId={warehouseId}
        shelves={allData}
        setShelves={setAllData}
        shelfClicked={shelfClicked}
      />
      {/* <ProductAddModel
        productOpen={productOpen}
        setProductOpen={setProductOpen}
        shelfClicked={shelfClicked}
        warehouseId={warehouseId}
      /> */}
      {/* <AddSubShelf
        handleClose={handleClose}
        open={open}
        warehouseId={warehouseId}
        shelves={allData}
        setShelves={setAllData}
        shelfClicked={shelfClicked}
      /> */}
    </>
  );
}
