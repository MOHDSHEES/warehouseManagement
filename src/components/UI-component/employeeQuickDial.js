import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useRouter } from "next/navigation";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { MyContext } from "../context";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import DescriptionIcon from "@mui/icons-material/Description";
import PostAddIcon from "@mui/icons-material/PostAdd";
// import NoteAltIcon from '@mui/icons-material/NoteAlt';
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export default function EmployeeQuickDial() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { privileges, user } = React.useContext(MyContext);

  const router = useRouter();
  function navigateTo(href) {
    router.push(href);
    setOpen(false);
  }

  const actions = [
    {
      icon: <PersonAddIcon />,
      name: "Add Employee",
      access: "Add_Employee",
      href: `/dashboard/employee/register`,
    },
    {
      icon: <PostAddIcon />,
      name: "Add Privileges",
      access: "Add_Privilege",
      href: `/dashboard/employee/privileges/add`,
    },
    {
      icon: <FormatListBulletedIcon />,
      name: "Privileges",
      access: "Edit_Privilege",
      href: `/dashboard/employee/privileges`,
    },
    // {
    //   icon: <WarehouseIcon />,
    //   name: "WareHouses",
    //   href: `/dashboard/warehouses`,
    // },
    //   { icon: <PrintIcon />, name: "Print" },
    //   { icon: <ShareIcon />, name: "Share" },
  ];

  return (
    <Box
      sx={{
        height: 320,
        transform: "translateZ(0px)",
        flexGrow: 1,
      }}
    >
      <SpeedDial
        ariaLabel="Quick Links"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => {
          let access = action.access ? privileges[action.access] : true;
          return (
            user &&
            (user._id === user.company._id || access) && (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => navigateTo(action.href)}
              />
            )
          );
        })}
      </SpeedDial>
    </Box>
  );
}
