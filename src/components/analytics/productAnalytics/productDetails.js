import { Card, CardHeader, Typography } from "@mui/material";
import React from "react";

const ProductDetails = ({ data }) => {
  return (
    <Card sx={{ p: 2 }}>
      {/* <CardHeader
        title={<small style={{ fontSize: "18px" }}>Product Details</small>}
      /> */}
      <Typography variant="subtitle1">
        <b>Name: </b> {data.productName}
      </Typography>
      <Typography variant="subtitle1">
        <b>Id: </b> {data.productId}
      </Typography>
    </Card>
  );
};

export default ProductDetails;
