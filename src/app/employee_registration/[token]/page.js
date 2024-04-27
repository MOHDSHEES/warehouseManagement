"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmployeeRegister from "@/src/components/employee/employeeRegister";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { MyContext } from "@/src/components/context";
import { closeMessage } from "@/src/components/functions/message";
// import Layout from "@/components/layout";

const Employee_Register = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const { messageApi } = useContext(MyContext);
  const [data, setData] = useState("");
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post("/api/employee/verifyToken", {
          token: params.token,
        });

        if (data.status === 404) {
          closeMessage(messageApi, data.msg, "error");
          router.replace("/");
          // setLoading(false);
        } else {
          setData(data);
          setLoading(false);
        }
      } catch (error) {
        // setLoading(false);
        closeMessage(messageApi, "Something went Wrong.", "error");
        router.replace("/");
      }
    };

    fetchData();
  }, [params.token, router]);
  if (loading) {
    return (
      <div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </div>
    );
  }
  return (
    <div>
      <EmployeeRegister token={params.token} data={data.data} />
    </div>
  );
};

export default Employee_Register;
