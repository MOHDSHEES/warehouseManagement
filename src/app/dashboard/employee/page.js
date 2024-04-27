"use client";
import EmployeeCard from "@/src/components/employee/employeeCard";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MyContext } from "@/src/components/context";
import { closeMessage } from "@/src/components/functions/message";
import {
  Alert,
  Button,
  Chip,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
// import Link from "next/link";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";
import EditEmployeeModel from "@/src/components/update/editEmployeeModel";
import FilterListIcon from "@mui/icons-material/FilterList";
import { ThreeDots } from "react-loader-spinner";

const Page = () => {
  // , employees, setEmployees,
  const { user } = useContext(MyContext);
  const [employees, setEmployees] = useState([]);
  const [editEmployeeOpen, setEditEmployeeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isMoreData, setIsMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [employeeLoadFlag, setEmployeeLoadFlag] = useState(true);
  const itemsPerPage = 15;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [filter, setFilter] = useState({ name: "all" });
  const [templates, setTemplates] = useState("");

  async function getEmployee(filterl = null, page = null) {
    flag = 0;
    if (!employees.length) setLoading(true);
    setLoadingMore(true);
    setEmployeeLoadFlag(true);
    const { data } = await axios.post(
      `/api/employee/get?page=${
        page ? page : currentPage
      }&perPage=${itemsPerPage}&&filter=${filterl ? filterl : "all"}`,
      {
        company: user.company,
      }
    );
    if (data.status === 200 && data.data.length) {
      if (page === 1) {
        setEmployees(data.data);
        setCurrentPage(page + 1);
      } else {
        setEmployees([...employees, ...data.data]);
        setCurrentPage(currentPage + 1);
        setEmployeeLoadFlag(false);
      }
      if (data.data.length < itemsPerPage) setIsMoreData(false);
      setLoadingMore(false);
      // setEmployees(data.data);
    } else {
      setLoadingMore(false);
      setIsMoreData(false);
      setEmployeeLoadFlag(false);
    }
    // else closeMessage(messageApi, data.msg, "error");
    setLoading(false);
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function filterFunction(filter) {
    handleClose();
    // setCurrentPage(1);
    setEmployeeLoadFlag(true);
    setFilter({ name: filter.name });
    setIsMoreData(true);
    setEmployees([]);
    getEmployee(filter.id, 1);
  }

  async function getPrivelegeTemplate() {
    const { data } = await axios.post("/api/user/privilegeTemplate/get", {
      company: user.company && user.company._id,
    });
    setTemplates(data.data);
  }
  useEffect(() => {
    if (user && templates === "") getPrivelegeTemplate();
  }, [user]);

  let flag = 1;
  useEffect(() => {
    if (flag && !employees.length) getEmployee();
  }, []);
  return (
    <UserAccessLayout>
      <Container requiredprivilege="View_Employee" maxWidth="xl">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Employees
              <Tooltip title="Filter">
                <IconButton
                  id="basic-button"
                  sx={{ float: "right", marginBottom: "10px" }}
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  aria-label="Filter"
                  size="large"
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: 50 * 4.5,
                    width: "20ch",
                  },
                }}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {templates && templates.length > 0 ? (
                  templates.map((template, idx) => {
                    return (
                      <MenuItem
                        key={idx}
                        onClick={() =>
                          filterFunction({
                            name: template.name,
                            id: template._id,
                          })
                        }
                      >
                        {template.name}
                      </MenuItem>
                    );
                  })
                ) : templates && templates.length === 0 ? (
                  <MenuItem>No templates Found</MenuItem>
                ) : (
                  <MenuItem>Loading...</MenuItem>
                )}
                {/* <MenuItem onClick={() => filterFunction("Active")}>
                  Active
                </MenuItem>
                <MenuItem onClick={() => filterFunction("Rejected")}>
                  Rejected
                </MenuItem>
                <MenuItem onClick={() => filterFunction("Inactive")}>
                  Inactive
                </MenuItem>
                <MenuItem onClick={() => filterFunction("all")}>
                  All Blogs
                </MenuItem> */}
              </Menu>
            </Typography>
            <Stack direction="row" spacing={1} sx={{ margin: "10px" }}>
              {/* <Chip label="Deletable" onDelete={() => "df"} /> */}
              {filter.name === "all" ? (
                <Chip label="All Employees" variant="outlined" />
              ) : (
                <Chip
                  label={filter.name}
                  variant="outlined"
                  onDelete={() => filterFunction({ name: "all" })}
                />
              )}
            </Stack>
          </div>

          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {loading ? (
              <Stack spacing={1}>
                <Skeleton variant="rectangular" height={140} />
                <Skeleton variant="rectangular" height={140} />
                <Skeleton variant="rectangular" height={140} />
              </Stack>
            ) : (
              <>
                {employees &&
                  (employees.length > 0
                    ? employees.map((employee, idx) => {
                        return (
                          <div key={idx} style={{ marginBottom: "10px" }}>
                            <EmployeeCard
                              open={editEmployeeOpen}
                              setSelectedEmployee={setSelectedEmployee}
                              setOpen={setEditEmployeeOpen}
                              employee={employee}
                              // privilegesTemplate={
                              //   user.company.privilegesTemplate
                              // }
                            />
                          </div>
                        );
                      })
                    : !employeeLoadFlag && (
                        <Alert icon={false} severity="info">
                          No Employee Found.
                        </Alert>
                      ))}
                {loadingMore ? (
                  <div style={{ marginTop: "10px" }}>
                    <ThreeDots
                      height="10"
                      width="80"
                      radius="1"
                      color="#4fa94d"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{ justifyContent: "center" }}
                      wrapperClassName=""
                      visible={true}
                    />
                  </div>
                ) : (
                  isMoreData && (
                    <div style={{ textAlign: "center" }}>
                      <button
                        style={{ marginTop: "10px", width: "100%" }}
                        onClick={() => getEmployee()}
                        className="btn btn-secondary secondary-1 "
                      >
                        Load More...
                      </button>
                    </div>
                  )
                )}
              </>
            )}
          </Container>
        </Stack>
      </Container>
      <EditEmployeeModel
        requiredprivilege="Edit_Employee"
        open={editEmployeeOpen}
        employeeData={selectedEmployee}
        setEmployeeData={setSelectedEmployee}
        setOpen={setEditEmployeeOpen}
        employees={employees}
        setEmployees={setEmployees}
        filterFunction={filterFunction}
        templates={templates}
      />
    </UserAccessLayout>
  );
};

export default Page;
