// import { SvgIcon } from "@mui/material";
import Person2Icon from "@mui/icons-material/Person2";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssignmentIcon from "@mui/icons-material/Assignment";

export const items = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: (
      // <SvgIcon fontSize="small">
      <Person2Icon sx={{ fontSize: 18 }} />
      // </SvgIcon>
    ),
  },
];
export const Orders = [
  {
    title: "Create New Order",
    path: "/dashboard/order/create",
    access: "Create_Order",
    icon: (
      // <SvgIcon fontSize="small">
      <GroupsIcon sx={{ fontSize: 18 }} />
      // </SvgIcon>
    ),
  },
  {
    title: "Orders",
    access: "View_Orders",
    path: "/dashboard/order",
    icon: (
      // <SvgIcon fontSize="small">
      <GroupAddIcon sx={{ fontSize: 18 }} />
      // </SvgIcon>
    ),
  },
];

export const Customers = [
  {
    title: "Customers",
    path: "/dashboard/customer",
    access: "View_Customer",
    icon: (
      // <SvgIcon fontSize="small">
      <GroupsIcon sx={{ fontSize: 18 }} />
      // </SvgIcon>
    ),
  },
  {
    title: "Add Customer",
    access: "Add_Customer",
    path: "/dashboard/customer/add",
    icon: (
      // <SvgIcon fontSize="small">
      <GroupAddIcon sx={{ fontSize: 18 }} />
      // </SvgIcon>
    ),
  },
];

export const employees = [
  {
    title: "Employees",
    access: "View_Employee",
    path: "/dashboard/employee",
    icon: (
      // <SvgIcon fontSize="small">
      <GroupIcon sx={{ fontSize: 18 }} />
      // </SvgIcon>
    ),
  },
  {
    title: "Add Employees",
    access: "Add_Employee",
    path: "/dashboard/employee/register",
    icon: (
      // <SvgIcon fontSize="small">
      <PersonAddIcon sx={{ fontSize: 18 }} />
      // </SvgIcon>
    ),
  },
  {
    title: "Privileges Templates",
    access: "Edit_Privilege",
    path: "/dashboard/employee/privileges",
    icon: (
      // <SvgIcon fontSize="small">
      <AssignmentIcon sx={{ fontSize: 18 }} />
      // </SvgIcon>
    ),
  },
];

export const warehouse = [
  {
    title: "WareHouses",
    path: "/dashboard/warehouses",
    icon: (
      // <SvgIcon fontSize="small">
      <WarehouseIcon sx={{ fontSize: 18 }} />
      // </SvgIcon>
    ),
  },
  {
    title: "Add Warehouse",
    access: "Add_Warehouse",
    path: "/admin/add_warehouse",
    icon: (
      // <SvgIcon fontSize="small">
      <AddBusinessIcon sx={{ fontSize: 18 }} />
      // </SvgIcon>
    ),
  },
];
