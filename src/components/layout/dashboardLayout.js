import React, { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import SideBar from "./sidebar";
import { Box } from "@mui/material";
import { TopNav } from "./top-bar";

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#ff2143",
      },
      info: {
        main: "#ffffff",
      },

      secondary: {
        main: "#1c2536",
      },
    },
  });
  return (
    <div>
      <TopNav onNavOpen={() => setOpen(true)} />
      <ThemeProvider theme={theme}>
        <SideBar onClose={() => setOpen(false)} open={open} />
      </ThemeProvider>
      <LayoutRoot>
        <LayoutContainer>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8,
            }}
          >
            {children}
          </Box>
        </LayoutContainer>
      </LayoutRoot>
    </div>
  );
};

export default DashboardLayout;
