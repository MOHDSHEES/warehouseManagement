"use client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
// import { MyContext } from "@/components/context";
import { useContext } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/navigation";
import { MyContext } from "../components/context";

export default function Homepage() {
  const router = useRouter();
  // const { data } = useSession();
  const { loading, user } = useContext(MyContext);
  return (
    <>
      <Container maxWidth="lg">
        <Box className="home-center">
          <Typography className="home-h2" variant="h3" gutterBottom>
            Welcome to
          </Typography>
          <Typography variant="h2" className="home-h2" gutterBottom>
            W<span style={{ color: "blue" }}>M</span>S
            {/* <span style={{ color: "red" }}>WEB</span> */}
          </Typography>

          {loading ? (
            <LoadingButton loading variant="outlined">
              Verifying...
            </LoadingButton>
          ) : user ? (
            <Button
              sx={{ mt: 2 }}
              onClick={() => router.push("/dashboard")}
              variant="contained"
              size="large"
            >
              View Dashboard
            </Button>
          ) : (
            <Button
              sx={{ mt: 2 }}
              onClick={() => router.push("/login")}
              variant="contained"
              size="large"
            >
              Login
            </Button>
          )}
        </Box>
      </Container>
    </>
  );
}
