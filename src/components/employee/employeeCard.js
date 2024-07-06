import React, { useContext, useEffect, useState } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { Button, Chip, Stack } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { MyContext } from "../context";

export default function EmployeeCard({
  employee,
  // privilegesTemplate,
  setSelectedEmployee,
  setOpen,
}) {
  // const [privileges, setPrivileges] = useState("");
  const { user, isAdmin, privileges } = useContext(MyContext);
  // function filterPrivileges() {
  //   flag = 0;
  //   const privilegeCommon = privilegesTemplate.filter(
  //     (template) => template.name === employee.privilegesTemplate
  //   );
  //   // console.log(privilegeCommon);
  //   if (privilegeCommon && privilegeCommon.length > 0) {
  //     const newPrivileges = {
  //       ...privilegeCommon[0].roles,
  //       ...employee.privileges,
  //     };
  //     setPrivileges(newPrivileges);
  //   } else {
  //     setPrivileges(employee.privileges);
  //   }
  // }
  // let flag = 1;
  // useEffect(() => {
  //   if (flag) filterPrivileges();
  // }, [employee]);
  function openEditModel() {
    setSelectedEmployee(employee);
    setOpen(true);
  }
  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        overflow: { xs: "auto", sm: "initial" },
      }}
    >
      <Card
        orientation="horizontal"
        sx={{
          width: "100%",
          overflow: "auto",
        }}
      >
        <CardContent>
          <Typography fontSize="xl" fontWeight="lg">
            {employee.name}
            {employee._id !== employee.company &&
              employee._id === user._id &&
              " (You)"}{" "}
            {employee._id === employee.company && (
              <VerifiedUserIcon
                sx={{ marginBottom: "3px" }}
                fontSize="small"
                color="primary"
              />
            )}
            {employee._id !== employee.company &&
              employee._id !== user._id &&
              (isAdmin || privileges.Edit_Employee) && (
                <Button
                  style={{ float: "right", marginRight: "5px" }}
                  variant="contained"
                  onClick={openEditModel}
                  color="primary"
                >
                  Edit
                </Button>
              )}
          </Typography>
          <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
            {employee.email}
          </Typography>

          <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
            {employee.address}
          </Typography>
          <Sheet
            sx={{
              bgcolor: "background.level1",
              borderRadius: "sm",
              p: 1.5,
              my: 1.5,
              display: "flex",
              gap: 2,
              "& > div": { flex: 1 },
            }}
          >
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Joining Date
              </Typography>
              <Typography fontWeight="lg">
                {employee.joiningDate ? employee.joiningDate : "-"}
              </Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Post
              </Typography>
              <Typography fontWeight="lg">{employee.post}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Job Type
              </Typography>
              <Typography fontWeight="lg">{employee.jobType}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Status
              </Typography>
              <Typography fontWeight="lg">
                {employee.status ? "Enabled" : "Disabled"}
              </Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Gender
              </Typography>
              <Typography fontWeight="lg">
                {employee.gender ? employee.gender : "-"}
              </Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Privilege Template
              </Typography>
              <Typography fontWeight="lg">
                {employee.privilegesTemplate
                  ? employee.privilegesTemplate.name
                  : employee._id === employee.company
                  ? "All"
                  : "-"}
              </Typography>
            </div>
          </Sheet>

          <Stack direction="row" sx={{ flexWrap: "wrap" }} spacing={1}>
            {employee &&
              employee.privilegesTemplate &&
              employee.privilegesTemplate._id &&
              Object.entries(employee.privilegesTemplate.roles).map(
                ([key, value], idx) => {
                  return (
                    value && (
                      <Chip
                        style={{ margin: "5px" }}
                        key={idx}
                        label={key}
                        size="small"
                        color="success"
                      />
                    )
                  );
                }
              )}
          </Stack>
          {employee.warehouse && employee.warehouse.length > 0 && (
            <Sheet
              sx={{
                bgcolor: "background.level1",
                borderRadius: "sm",
                p: 1.5,
                my: 1.5,
                display: "flex",
                gap: 2,
                "& > div": { flex: 1 },
              }}
            >
              <div>
                <Typography level="body-xs" fontWeight="lg">
                  Warehouse
                </Typography>
                {/* <Typography fontWeight="lg"> */}
                {employee.warehouse.map((warehouse, idx) => {
                  return (
                    <Chip
                      style={{ margin: "5px" }}
                      key={idx}
                      label={warehouse.warehouseName}
                      size="small"
                      // color="success"
                    />
                  );
                })}
                {/* </Typography> */}
              </div>
            </Sheet>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
