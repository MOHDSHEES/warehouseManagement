"use client";
import WareHouseTable from "@/src/components/admin/warehouseTable";
import { Container, Stack, Typography } from "@mui/material";
import React from "react";

const Page = () => {
  return (
    <div>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">WareHouses</Typography>
            {/* <button onClick={test} className="btn btn-primary">
          test
        </button> */}
          </div>

          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <WareHouseTable />
          </Container>
        </Stack>
      </Container>
    </div>
  );
};

export default Page;
