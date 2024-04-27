"use client";

import ProductsDetail from "@/src/components/admin/productDetails/productsDetail";
import { MyContext } from "@/src/components/context";
import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import OutOfStock from "@/src/components/admin/productDetails/outOfStock";
import Link from "next/link";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";

const Page = ({ params }) => {
  const { messageApi, productIds, setProductIds, privileges, isAdmin } =
    useContext(MyContext);
  const [productIdsData, setProductIdData] = useState(null);
  const [outOfStockData, setOutOfStockData] = useState(null);
  // console.log(privileges);

  async function getFinishedProductsCount() {
    const { data } = await axios.post("/api/product/finishedProductsCount", {
      warehouse: params.id,
    });
    if (data && data.status === 200) {
      //   console.log(data);
      setOutOfStockData(data.data);
      //   console.log(data);
    } else closeMessage(messageApi, data.msg, "error");
  }

  useEffect(() => {
    getFinishedProductsCount();
  }, [params.id]);

  async function getProductIds() {
    flag = 0;
    const { data } = await axios.post("/api/product/getProductIds", {
      warehouse: params.id,
    });
    if (data && data.status === 200) {
      setProductIdData(data.data);
      setProductIds([
        ...productIds,
        { warehouseId: params.id, productIds: data.data },
      ]);
    } else closeMessage(messageApi, data.msg, "error");
  }
  let flag = 1;
  useEffect(() => {
    if (flag) {
      const filteredItem = productIds.find(
        (item) => item.warehouseId === params.id
      );

      if (filteredItem) {
        setProductIdData(filteredItem.productIds);
      } else getProductIds();
    }
  }, [params.id]);

  return (
    <UserAccessLayout>
      <div requiredprivilege="Inventory">
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Inventory</Typography>
              {/* <button onClick={test} className="btn btn-primary">
          test
        </button> */}
            </div>

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
              {/* <AddShelf warehouseId={params.id} /> */}
              <UserAccessLayout>
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
                              Product Details:
                            </small>
                          }
                          action={
                            (isAdmin ||
                              (privileges && privileges.Register_Product)) && (
                              <Link
                                href={`/dashboard/warehouses/${params.id}/add_product`}
                              >
                                <Button variant="contained">Add Product</Button>
                              </Link>
                            )
                          }
                        />
                        <ProductsDetail
                          productIdsData={productIdsData}
                          outOfStockData={outOfStockData}
                        />
                      </Card>
                    </Grid>
                  </Box>
                </Container>

                <Container
                  requiredprivilege="Out_Of_Stock"
                  maxWidth="xl"
                  sx={{ mt: 1, mb: 4, padding: 0 }}
                >
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
                              Out Of Stock Products:
                            </small>
                          }
                          //   action={
                          //     <Button
                          //       variant="contained"
                          //       href={`/dashboard/warehouses/${params.id}/add_product`}
                          //     >
                          //       Add Product
                          //     </Button>
                          //   }
                        />
                        {!outOfStockData ? (
                          <Skeleton variant="rounded" height={60} />
                        ) : outOfStockData.count === 0 &&
                          productIdsData &&
                          productIdsData.length !== 0 ? (
                          <Alert severity="success">
                            All products are currently in stock.
                          </Alert>
                        ) : outOfStockData.count === 0 ? (
                          <Alert severity="warning">
                            There are no available products in stock. Please
                            consider adding some.
                          </Alert>
                        ) : (
                          <OutOfStock outOfStockData={outOfStockData} />
                        )}
                      </Card>
                    </Grid>
                  </Box>
                </Container>
              </UserAccessLayout>
            </Container>
          </Stack>
        </Container>
      </div>
    </UserAccessLayout>
  );
};

export default Page;
