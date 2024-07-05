"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MyContext } from "@/src/components/context";
import { closeMessage, openMessage } from "@/src/components/functions/message";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardHeader,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Button,
  Skeleton,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import WarehouseDetails from "@/src/components/admin/warehouseDetails/warehouseDetails";
import ShelfTreeMain from "@/src/components/admin/shelf/shelfTree/shelfTreeMain";
import Link from "next/link";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShelfSearchModel from "@/src/components/admin/shelf/sheflSearchModel";
import QRCodeScanner from "@/src/components/functions/qrCodeScanner";
import SearchedShelfModel from "@/src/components/admin/shelf/searchedShelfModel";

const Page = ({ params }) => {
  // console.log(params.id);
  const {
    warehouses = "null",
    messageApi,
    privileges,
    isAdmin,
  } = useContext(MyContext);
  const [warehouse, setWarehouse] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [shelfSearchModel, setShelfSearchModel] = useState(false);
  // console.log(warehouse);
  const router = useRouter();
  // console.log(data);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // Check if session exists and user has access to this warehouse

  async function getWarehouse(id) {
    token = 0;
    // try {
    const { data } = await axios.post("/api/warehouse/getDetails", {
      ids: [id],
    });
    if (data && data.status === 200 && data.data && data.data.length) {
      setWarehouse(data.data[0]);
    } else {
      closeMessage(
        messageApi,
        "No warehouse found with the provided Id",
        "error"
      );
      router.replace("/dashboard/warehouses");
    }
  }
  // console.log(warehouse);
  let token = 1;
  useEffect(() => {
    if (params.id) {
      if (warehouses) {
        const ware = warehouses.filter(
          (warehouse) => warehouse._id === params.id
        );
        setWarehouse(ware && ware.length ? ware[0] : null);
      }
      if (token) getWarehouse(params.id);
    }
  }, [params, warehouses]);

  // const [scannedData, setScannedData] = useState("");
  // const [scannerOpen, setScannerOpen] = useState(false);

  // const handleDetected = (data) => {
  //   setScannedData(data);
  //   setScannerOpen(false); // Close scanner after detecting a barcode
  // };

  // const handleOpenScanner = () => {
  //   setScannerOpen(true);
  // };

  // console.log(scannedData);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanData, setScanData] = useState("");
  const [searchedShelfModel, setSearchedShelfModel] = useState(false);
  const [shelfDetail, setShelfDetail] = useState(null);

  async function searchShelf(id) {
    console.log("in", id);
    openMessage(messageApi, "Searching...");
    const { data } = await axios.post("/api/shelf/findById", {
      shelfId: id,
      warehouse: warehouse,
    });
    // console.log(data);
    if (data.status === 200) {
      messageApi.destroy();
      setSearchedShelfModel(true);
      setShelfDetail(data.data);
    } else closeMessage(messageApi, data.msg, "error");
  }

  const handleOpenScanner = () => {
    setScannerOpen(true);
  };

  const handleCloseScanner = () => {
    setScannerOpen(false);
  };
  // console.log(scanData);
  return (
    <div>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <div>
            {!warehouse ? (
              <Skeleton variant="rounded" width={300} height={60} />
            ) : (
              <Typography variant="h4">
                {warehouse ? warehouse.warehouseName : "Warehouse Name"}
              </Typography>
            )}
          </div>

          {/* warehouse details */}
          <Container maxWidth="xl" sx={{ mt: 1, mb: 4, padding: 0 }}>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 3,
              }}
            >
              <Grid item xs={12} md={6} lg={6}>
                <Card sx={{ p: 2 }}>
                  <CardHeader
                    title={
                      <small style={{ fontSize: "18px" }}>
                        Warehouse Details:
                      </small>
                    }
                    action={
                      <Link
                        style={{ color: "black" }}
                        href={`/dashboard/warehouses/${params.id}/inventory`}
                      >
                        <Button
                          variant="contained"
                          // href={`/dashboard/warehouses/${params.id}/inventory`}
                        >
                          Inventory
                        </Button>
                      </Link>
                    }
                  />
                  {/* {warehouse && ( */}
                  <WarehouseDetails warehouseDetails={warehouse} />
                  {/* )} */}
                </Card>
              </Grid>
            </Box>
          </Container>

          {/* shelf table */}
          <Container maxWidth="xl" sx={{ mt: 1, mb: 4, padding: 0 }}>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 3,
              }}
            >
              <Grid item xs={12} md={6} lg={6}>
                <Card sx={{ p: 2 }}>
                  <CardHeader
                    title={
                      <small style={{ fontSize: "18px" }}>Shelf Details:</small>
                    }
                    action={
                      // ((privileges && privileges.Add_Shelf) || isAdmin) && (
                      <>
                        <Tooltip title="Filter">
                          <IconButton
                            id="basic-button"
                            sx={{ float: "right", marginBottom: "10px" }}
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                            aria-label="Filter"
                            size="large"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          PaperProps={{
                            style: {
                              maxHeight: 50 * 4.5,
                              width: "20ch",
                            },
                          }}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              handleClose(), setShelfSearchModel(true);
                            }}
                          >
                            Search Shelf
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleClose(), handleOpenScanner();
                            }}
                          >
                            Scan Shelf
                          </MenuItem>
                          {((privileges && privileges.Add_Shelf) ||
                            isAdmin) && (
                            <MenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/warehouses/${params.id}/add_shelf`
                                )
                              }
                            >
                              Add Shelf
                            </MenuItem>
                          )}
                        </Menu>
                      </>

                      // )
                    }
                  />
                  <ShelfTreeMain warehouseId={params.id} />

                  {/* <ShelfTable warehouseId={params.id} /> */}
                </Card>
              </Grid>
            </Box>
          </Container>
        </Stack>
      </Container>
      <QRCodeScanner
        isOpen={scannerOpen}
        onClose={handleCloseScanner}
        setScanData={setScanData}
        searchShelf={searchShelf}
      />
      <ShelfSearchModel
        open={shelfSearchModel}
        setOpen={setShelfSearchModel}
        warehouse={params.id}
      />
      <SearchedShelfModel
        setOpen={setSearchedShelfModel}
        open={searchedShelfModel}
        shelf={shelfDetail}
        warehouse={warehouse}
      />
    </div>
  );
};

export default Page;
