import { Card, CardHeader, Stack, Typography } from "@mui/material";
import React from "react";

const ProductDetails = ({ data }) => {
  return (
    <Card sx={{ p: 2 }}>
      {/* <CardHeader
        title={<small style={{ fontSize: "18px" }}>Product Details</small>}
      /> */}
      <Stack spacing={1}>
        <Typography variant="body2">
          <b>Name: </b> {data.productName}
        </Typography>
        <Typography variant="body2">
          <b>Id: </b> {data.productId}
        </Typography>
      </Stack>
    </Card>
  );
};

export default ProductDetails;
