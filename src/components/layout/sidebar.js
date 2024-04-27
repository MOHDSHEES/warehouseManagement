import NextLink from "next/link";
import {
  Box,
  ButtonBase,
  Divider,
  Drawer,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SideNavItem from "./side-nav-item.js";
import { usePathname } from "next/navigation.js";
import {
  Customers,
  Orders,
  blogsItems,
  employees,
  items,
  jobsItems,
  warehouse,
} from "./listItems.js";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";
import BackdropComponent from "../UI-component/backdrop.js";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../context.js";
// import { MyContext } from "../context.js";

// import handleGeneratePdf from "../functions/certificate.js";
// import dynamic from "next/dynamic";
// const GenerateCertificate = dynamic(
//   () => import("../functions/certificate.js"),
//   { ssr: false }
// );

export default function SideBar(props) {
  const { open, onClose } = props;
  const dashBoardRegex = /^\/dashboard\/warehouses(?:\/.*)?$/;
  const employeeRegex = /^\/dashboard\/employee(?:\/.*)?$/;
  // const { user } = useContext(MyContext);
  const pathname = usePathname();
  const { privileges: priv, isAdmin } = useContext(MyContext);

  const [privileges, setPrivileges] = useState(priv);
  // console.log(privileges);
  useEffect(() => {
    setPrivileges(priv);
  }, [priv]);
  // console.log(pathname);
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const [openBackdrop, setOpenBackdrop] = useState(false);
  function logout() {
    setOpenBackdrop(true);
    signOut();
    // setOpenBackdrop(false);
  }

  const content = (
    <Box
      className="scrollbarT"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          component={NextLink}
          href="/"
          sx={{
            display: "inline-flex",
            height: 32,
            width: 32,
          }}
        >
          OFFTHEWEB
        </Box>
        {/* <Box
          sx={{
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            borderRadius: 1,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            p: "12px",
          }}
        >
          <div>
            <Typography color="inherit" variant="subtitle1">
              Devias
            </Typography>
            <Typography color="neutral.400" variant="body2">
              Production
            </Typography>
          </div>
        </Box> */}
      </Box>
      <Divider sx={{ borderColor: "neutral.700" }} />
      <Box
        component="nav"
        sx={{
          flexGrow: 1,
          px: 2,
          py: 3,
        }}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
          }}
        >
          {items.map((item) => {
            // console.log(item.path);
            // const active = item.path ? pathname === item.path : false;
            let active;
            let access = item.access
              ? isAdmin || privileges[item.access]
              : true;

            // console.log(regex.test("/dashboard/warehouses"));
            if (item.path === "/dashboard/warehouses")
              active = item.path ? dashBoardRegex.test(pathname) : false;
            else if (item.path === "/dashboard/employee")
              active = item.path ? employeeRegex.test(pathname) : false;
            else active = item.path ? pathname === item.path : false;
            return (
              <SideNavItem
                active={active}
                disabled={item.disabled}
                external={item.external}
                icon={item.icon}
                key={item.title}
                path={item.path}
                title={item.title}
                access={access}
                dropdownItems={item.dropdownItems}
              />
            );
          })}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "black" }} />
      <Box
        component="nav"
        sx={{
          flexGrow: 1,
          px: 2,
          py: 1,
          paddingBottom: 3,
        }}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
          }}
        >
          <Box sx={{ paddingLeft: 2 }}>
            <Box
              sx={{
                display: "inline-flex",
                height: 32,
                width: 32,
              }}
            >
              Warehouses
            </Box>
          </Box>
          {warehouse.map((item) => {
            let active;
            let access = item.access
              ? isAdmin || privileges[item.access]
              : true;
            // console.log(regex.test("/dashboard/warehouses"));
            if (item.path === "/dashboard/warehouses")
              active = item.path ? dashBoardRegex.test(pathname) : false;
            // else if (item.path === "/dashboard/employee")
            //   active = item.path ? employeeRegex.test(pathname) : false;
            else active = item.path ? pathname === item.path : false;
            return (
              <SideNavItem
                active={active}
                disabled={item.disabled}
                external={item.external}
                icon={item.icon}
                key={item.title}
                path={item.path}
                title={item.title}
                access={access}
                dropdownItems={item.dropdownItems}
              />
            );
          })}
        </Stack>
      </Box>
      <Divider sx={{ borderColor: "black" }} />

      <Box
        component="nav"
        sx={{
          flexGrow: 1,
          px: 2,
          py: 1,
          paddingBottom: 3,
        }}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
          }}
        >
          {(isAdmin ||
            Orders.some((item) => item.access && privileges[item.access])) && (
            <Box sx={{ paddingLeft: 2 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  height: 32,
                  width: 32,
                }}
              >
                Orders
              </Box>
            </Box>
          )}
          {Orders.map((item) => {
            let active;
            let access = item.access
              ? isAdmin || privileges[item.access]
              : true;
            // console.log(regex.test("/dashboard/warehouses"));

            active = item.path ? pathname === item.path : false;
            return (
              <SideNavItem
                active={active}
                disabled={item.disabled}
                external={item.external}
                icon={item.icon}
                key={item.title}
                path={item.path}
                title={item.title}
                access={access}
                dropdownItems={item.dropdownItems}
              />
            );
          })}
        </Stack>
      </Box>
      <Divider sx={{ borderColor: "black" }} />

      <Box
        component="nav"
        sx={{
          flexGrow: 1,
          px: 2,
          py: 1,
          paddingBottom: 3,
        }}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
          }}
        >
          {(isAdmin ||
            Customers.some(
              (item) => item.access && privileges[item.access]
            )) && (
            <Box sx={{ paddingLeft: 2 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  height: 32,
                  width: 32,
                }}
              >
                Customers
              </Box>
            </Box>
          )}
          {Customers.map((item) => {
            let active;
            let access = item.access
              ? isAdmin || privileges[item.access]
              : true;
            // console.log(regex.test("/dashboard/warehouses"));
            // if (item.path === "/dashboard/warehouses")
            //   active = item.path ? dashBoardRegex.test(pathname) : false;
            // else if (item.path === "/dashboard/employee")
            //   active = item.path ? employeeRegex.test(pathname) : false;
            active = item.path ? pathname === item.path : false;
            return (
              <SideNavItem
                active={active}
                disabled={item.disabled}
                external={item.external}
                icon={item.icon}
                key={item.title}
                path={item.path}
                title={item.title}
                access={access}
                dropdownItems={item.dropdownItems}
              />
            );
          })}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "black" }} />
      <Box
        component="nav"
        sx={{
          flexGrow: 1,
          px: 2,
          py: 1,
          paddingBottom: 3,
        }}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
          }}
        >
          {employees.some(
            (item) => item.access && (isAdmin || privileges[item.access])
          ) && (
            <Box sx={{ paddingLeft: 2 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  height: 32,
                  width: 32,
                }}
              >
                Employees
              </Box>
            </Box>
          )}
          {employees.map((item) => {
            let active;
            let access = item.access
              ? isAdmin || privileges[item.access]
              : true;
            // console.log(regex.test("/dashboard/warehouses"));
            // if (item.path === "/dashboard/warehouses")
            //   active = item.path ? dashBoardRegex.test(pathname) : false;
            // else if (item.path === "/dashboard/employee")
            //   active = item.path ? employeeRegex.test(pathname) : false;
            active = item.path ? pathname === item.path : false;
            return (
              <SideNavItem
                active={active}
                disabled={item.disabled}
                external={item.external}
                icon={item.icon}
                key={item.title}
                path={item.path}
                title={item.title}
                access={access}
                dropdownItems={item.dropdownItems}
              />
            );
          })}
        </Stack>
      </Box>
      <Divider sx={{ borderColor: "black" }} />
      <Box
        sx={{
          px: 2,
          py: 2,
        }}
      >
        <li onClick={logout}>
          <ButtonBase
            sx={{
              alignItems: "center",
              borderRadius: 1,
              display: "flex",
              justifyContent: "flex-start",
              pl: "16px",
              pr: "16px",
              py: "6px",
              textAlign: "left",
              width: "100%",
              // ...(active && {
              //   backgroundColor: "rgba(255, 255, 255, 0.04)",
              // }),
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
              },
            }}
            // {...linkProps}
          >
            {/* {icon && ( */}
            <Box
              component="span"
              sx={{
                alignItems: "center",
                color: "neutral.400",
                display: "inline-flex",
                justifyContent: "center",
                mr: 2,
                // ...(active && {
                //   color: "primary.main",
                // }),
              }}
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
            </Box>
            {/* )} */}
            <Box
              component="span"
              sx={{
                color: "neutral.400",
                flexGrow: 1,
                fontFamily: (theme) => theme.typography.fontFamily,
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "24px",
                whiteSpace: "nowrap",
                // ...(active && {
                //   color: "common.white",
                // }),
                // ...(disabled && {
                //   color: "neutral.500",
                // }),
              }}
            >
              Logout
            </Box>
          </ButtonBase>
        </li>
      </Box>
    </Box>
    // </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            // backgroundColor: "neutral.800",
            backgroundColor: (theme) => theme.palette.secondary.main,
            color: (theme) => theme.palette.info.main,
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
        <BackdropComponent open={openBackdrop} />
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          // backgroundColor: "neutral.800",
          backgroundColor: (theme) => theme.palette.secondary.main,
          color: (theme) => theme.palette.info.main,
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
      <BackdropComponent open={openBackdrop} />
    </Drawer>
  );
}
