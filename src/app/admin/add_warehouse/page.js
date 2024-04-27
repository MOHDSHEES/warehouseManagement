"use client";
import AddWareHouse from "@/src/components/admin/addWarehouse";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";
import { Container, Stack, Typography } from "@mui/material";
import React from "react";

const Page = () => {
  return (
    <UserAccessLayout>
      <div requiredPrivilege="Add_Warehouse">
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Add WareHouse</Typography>
              {/* <button onClick={test} className="btn btn-primary">
                test
              </button> */}
            </div>

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
              <AddWareHouse />
            </Container>
          </Stack>
        </Container>
      </div>
    </UserAccessLayout>
  );
};

export default Page;
