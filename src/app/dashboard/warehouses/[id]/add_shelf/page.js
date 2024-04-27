"use client";
import AddShelf from "@/src/components/admin/shelf/addShelf";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";
import { Container, Stack, Typography } from "@mui/material";
import React from "react";

const Page = ({ params }) => {
  return (
    <UserAccessLayout>
      <div requiredprivilege="Add_Shelf">
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Shelf</Typography>
              {/* <button onClick={test} className="btn btn-primary">
          test
        </button> */}
            </div>

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
              <AddShelf warehouseId={params.id} />
            </Container>
          </Stack>
        </Container>
      </div>
    </UserAccessLayout>
  );
};

export default Page;
