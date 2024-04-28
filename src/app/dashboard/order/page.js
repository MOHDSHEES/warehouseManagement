"use client";
import OrdersTable from "@/src/components/orders/ordersList/ordersTable";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MyContext } from "@/src/components/context";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";
import {
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { closeMessage } from "@/src/components/functions/message";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterModel from "@/src/components/orders/ordersList/filterModel";
import FilterChip from "@/src/components/orders/ordersList/filterChip";

const OrdersList = () => {
  const { user, messageApi } = useContext(MyContext);
  //   console.log(user);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState({
    party: "",
    orderType: "",
    startDate: "",
    endDate: "",
    totalPrice: "",
    comparison: "",
  });

  function onChangeFilter(e) {
    const { name, value } = e.target;

    setFilter({
      ...filter,
      [name]: value,
    });
  }

  function getFilteredOrders(filter) {
    setOrders(null);
    getOrders(1, filter);
    setOpen(false);
  }

  //   (isAdmin || privileges.View_Customer)

  useEffect(() => {
    if (user && !orders) getOrders(1);
  }, []);

  async function getOrders(cPage, cFilter) {
    setLoading(true);
    // console.log(cPage);
    const { data } = await axios.post(
      `/api/order/getList?page=${cPage ? cPage - 1 : page - 1}&perPage=${10}`,
      {
        company: user.company._id,
        filter: cFilter ? cFilter : filter,
      }
    );
    if (data.status === 200) {
      setOrders(data.data);
      setPage(page + 1);
    } else if (data.status === 500) closeMessage(messageApi, data.msg, "error");
    setLoading(false);
  }

  function handleFilterModel() {
    setOpen(true);
  }
  //   console.log(filter);
  function filterFunction(key) {
    setOrders(null);
    // if (key === "party") setFilter({ ...filter, [key]: "" });
    if (key === "totalPrice") {
      setFilter({ ...filter, ...{ totalPrice: "", comparison: "" } });
      getOrders(1, { ...filter, ...{ totalPrice: "", comparison: "" } });
    } else if (key === "bothDate") {
      setFilter({ ...filter, ...{ startDate: "", endDate: "" } });
      getOrders(1, { ...filter, ...{ startDate: "", endDate: "" } });
    } else {
      setFilter({ ...filter, [key]: "" });
      getOrders(1, { ...filter, [key]: "" });
    }
  }
  return (
    <UserAccessLayout>
      <Container requiredprivilege="View_Orders" maxWidth="xl">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Orders
              <Tooltip title="Filter">
                <IconButton
                  id="basic-button"
                  sx={{ float: "right", marginBottom: "10px" }}
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleFilterModel}
                  aria-label="Filter"
                  size="large"
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Typography>
            <Stack direction="row" spacing={1} sx={{ margin: "10px" }}>
              <FilterChip filter={filter} filterFunction={filterFunction} />
            </Stack>
          </div>

          <OrdersTable orders={orders} loading={loading} />
        </Stack>
      </Container>
      <FilterModel
        requiredprivilege="View_Orders"
        open={open}
        setOpen={setOpen}
        filter={filter}
        setFilter={setFilter}
        onChangeFilter={onChangeFilter}
        getFilteredOrders={getFilteredOrders}
      />
    </UserAccessLayout>
  );
};

export default OrdersList;
