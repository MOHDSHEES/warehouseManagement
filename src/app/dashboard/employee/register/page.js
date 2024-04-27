"use client";

// import DashboardLayout from "@/components/dashboardLayout";
import { AddEmployee } from "@/src/components/employee/addEmployee";
import {
  Button,
  ButtonGroup,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";

const Employee = () => {
  return (
    <UserAccessLayout>
      <div requiredprivilege="Add_Employee">
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Register Employee</Typography>
              <Link href="/dashboard/employee/privileges/add">
                <Button
                  sx={{ float: "right", mt: 2 }}
                  variant="outlined"
                  startIcon={<AddIcon />}
                >
                  privileges Template
                </Button>
              </Link>
            </div>

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, padding: 0 }}>
              <AddEmployee />
            </Container>
          </Stack>
        </Container>
      </div>
    </UserAccessLayout>
  );
};

export default Employee;
