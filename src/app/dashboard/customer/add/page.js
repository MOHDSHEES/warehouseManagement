"use client";
import React from "react";
import { Container, Stack, Typography } from "@mui/material";
import AddCustomer from "@/src/components/customers/addCustomer";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";

const Page = () => {
  return (
    <UserAccessLayout>
      <Container requiredprivilege="Add_Customer" maxWidth="xl">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">Register Customer</Typography>
            {/* <Link href="/dashboard/employee/privileges/add">
              <Button
                sx={{ float: "right", mt: 2 }}
                variant="outlined"
                startIcon={<AddIcon />}
              >
                privileges Template
              </Button>
            </Link> */}
          </div>

          <Container maxWidth="xl" sx={{ mt: 4, mb: 4, padding: 0 }}>
            <AddCustomer />
          </Container>
        </Stack>
      </Container>
    </UserAccessLayout>
  );
};

export default Page;
