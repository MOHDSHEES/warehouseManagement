"use client";

import * as React from "react";
// import { AccountProfile } from "@/components/dashboard/account/accountProfile";
import {
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { AccountProfileDetails } from "@/src/components/dashboard/profileDetails";
import { AccountProfile } from "@/src/components/dashboard/accountProfile";

export default function Dashboard() {
  // const { data: session } = useSession();
  // async function test() {
  //   const { data } = await axios.post("/api/google");
  //   console.log(data);
  // }
  return (
    <>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">Account</Typography>
            {/* <button onClick={test} className="btn btn-primary">
                test
              </button> */}
          </div>

          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <div style={{ marginBottom: "20px" }}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={4}>
                  <AccountProfile />
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                  <AccountProfileDetails />
                </Grid>
              </Grid>
            </div>
          </Container>
        </Stack>
      </Container>
    </>
  );
}
