import { Card, CardHeader, Stack, Typography } from "@mui/material";
import React from "react";

const CustomerDetails = ({ data }) => {
  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Typography variant="body2">
          <b>Name: </b> {data.name}
        </Typography>
        {data.email && (
          <Typography variant="body2">
            <b>Email: </b> {data.email}
          </Typography>
        )}
        {data.mobileNo && (
          <Typography variant="body2">
            <b>Mobile No: </b> {data.mobileNo}
          </Typography>
        )}
        <Typography variant="body2">
          <b>Address: </b> {data.address}
        </Typography>
      </Stack>
    </Card>
  );
};

export default CustomerDetails;
