"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MyContext } from "@/src/components/context";
import { closeMessage } from "@/src/components/functions/message";
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
} from "@mui/material";
import WarehouseDetails from "@/src/components/admin/warehouseDetails/warehouseDetails";
import ShelfTreeMain from "@/src/components/admin/shelf/shelfTree/shelfTreeMain";
import Link from "next/link";

const Page = ({ params }) => {
  // console.log(params.id);
  const { warehouses, messageApi, privileges, isAdmin } = useContext(MyContext);
  const [warehouse, setWarehouse] = useState(null);
  // console.log(warehouse);
  const router = useRouter();
  // console.log(data);
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
  return (
    <div>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              {warehouse ? warehouse.warehouseName : "Warehouse Name"}
            </Typography>
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
                  {warehouse && (
                    <WarehouseDetails warehouseDetails={warehouse} />
                  )}
                </Card>
              </Grid>
            </Box>
          </Container>

          {/* Product Details */}
          {/* <Container maxWidth="xl" sx={{ mt: 1, mb: 4, padding: 0 }}>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 3,
              }}
            >
              <Grid xs={12} md={6} lg={6}>
                <Card sx={{ p: 2 }}>
                  <CardHeader
                    title={
                      <small style={{ fontSize: "18px" }}>
                        Product Details:
                      </small>
                    }
                    action={
                      <Button
                        variant="contained"
                        href={`/dashboard/warehouses/${params.id}/add_product`}
                      >
                        List Product
                      </Button>
                    }
                  />
                  <ProductDetails />
                </Card>
              </Grid>
            </Box>
          </Container> */}

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
                      ((privileges && privileges.Add_Shelf) || isAdmin) && (
                        <Link
                          href={`/dashboard/warehouses/${params.id}/add_shelf`}
                        >
                          <Button
                            variant="contained"
                            // href={`/dashboard/warehouses/${params.id}/add_shelf`}
                          >
                            Add Shelf
                          </Button>
                        </Link>
                      )
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
    </div>
  );
};

export default Page;
