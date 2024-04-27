import React, { useState } from "react";
// import PropTypes from "prop-types";
import { Box, ButtonBase, Collapse, List, Menu, MenuItem } from "@mui/material";
import NextLink from "next/link";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const SideNavItem = (props) => {
  const {
    active = false,
    disabled,
    external,
    icon,
    path,
    title,
    onClick,
    access,
    dropdownItems,
  } = props;
  // console.log(dropdownItems);
  const linkProps = path
    ? external
      ? {
          component: "a",
          href: path,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};

  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  return (
    <>
      {access && (
        <>
          <li
            onClick={onClick}
            className={`${active && "sidebar-item-active"}`}
          >
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
                ...(active && {
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                }),
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                },
              }}
              {...(dropdownItems ? { onClick: handleClick } : linkProps)}
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
                  ...(active && {
                    color: "primary.main",
                  }),
                }}
              >
                {icon}
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
                  ...(active && {
                    color: "common.white",
                  }),
                  ...(disabled && {
                    color: "neutral.500",
                  }),
                }}
              >
                {title}
              </Box>
              {dropdownItems ? open ? <ExpandLess /> : <ExpandMore /> : ""}
            </ButtonBase>
          </li>

          <Collapse
            sx={{ background: "rgba(255, 255, 255, 0.09)" }}
            in={open}
            timeout="auto"
            unmountOnExit
          >
            {dropdownItems &&
              dropdownItems.map((dropdown, idx) => {
                return (
                  <List key={idx} component="div" disablePadding>
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
                        ...(active && {
                          backgroundColor: "rgba(255, 255, 255, 0.04)",
                        }),
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.04)",
                        },
                      }}
                      // {...(dropdownItems ? { onClick: handleClick } : linkProps)}
                      {...linkProps}
                    >
                      <Box
                        component="span"
                        sx={{
                          alignItems: "center",
                          color: "neutral.400",
                          display: "inline-flex",
                          justifyContent: "center",
                          pl: 4,
                          mr: 2,
                          // ...(active && {
                          //   color: "primary.main",
                          // }),
                        }}
                      >
                        {dropdown.icon}
                      </Box>
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
                        {dropdown.title}
                      </Box>
                    </ButtonBase>
                  </List>
                );
              })}
          </Collapse>
        </>
      )}
    </>
  );
};

export default SideNavItem;
