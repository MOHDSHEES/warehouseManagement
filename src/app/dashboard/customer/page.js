"use client";
import CustomersTable from "@/src/components/customers/customersTable";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";
import { Container, Stack, Typography } from "@mui/material";
import React from "react";

const Customer = () => {
  return (
    <UserAccessLayout>
      <Container requiredprivilege="View_Customer" maxWidth="xl">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">Customers</Typography>
            {/* <button onClick={test} className="btn btn-primary">
          test
        </button> */}
          </div>

          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <CustomersTable />
          </Container>
        </Stack>
      </Container>
    </UserAccessLayout>
  );
};

export default Customer;
