"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Login from "@/src/components/register/login";
import { Box, CircularProgress } from "@mui/material";
// import Layout from "@/components/layout";

const SignIn = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  // if (session) {
  //   router.replace("/");
  // }
  useEffect(() => {
    if (session && session.user) {
      setLoading(true);
      router.replace("/dashboard", undefined, {
        onComplete: () => setLoading(false),
      });
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session]);
  if (loading)
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
  if (!session || !session.user) {
    return (
      <div>
        <Login />
      </div>
    );
  }
};

export default SignIn;
