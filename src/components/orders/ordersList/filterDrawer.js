import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {
  TextField,
  Unstable_Grid2 as Grid,
  Card,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SwipeableDrawer,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function FilterDrawer({
  open,
  setOpen,
  filter,
  setFilter,
  //   onChangeFilter,
  getFilteredOrders,
}) {
  const [filterState, setFilterState] = useState({
    party: "",
    orderType: "",
    startDate: "",
    endDate: "",
    totalPrice: "",
    comparison: "",
  });

  function onChangeFilter(e) {
    const { name, value } = e.target;

    setFilterState({
      ...filterState,
      [name]: value,
    });
  }

  useEffect(() => {
    setFilterState(filter);
  }, [filter]);

  const toggleDrawer = (newOpen) => () => {
    if (!newOpen) {
      setFilterState(filter);
    }
    setOpen(newOpen);
  };

  function submitHandler(e) {
    e.preventDefault();
    setFilter(filterState);
    getFilteredOrders(filterState);
  }

  const DrawerList = (
    <form onSubmit={submitHandler}>
      <DialogContent>
        <IconButton
          onClick={toggleDrawer(false)}
          style={{ float: "right" }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Filter
        </Typography>

        <DialogContentText>
          Customize your search by applying one or more filters.
        </DialogContentText>
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: "center" }}
          className="mt-2 mb-3"
        >
          <Grid xs={12} sm={12}>
            <Card sx={{ p: 2 }}>
              <Typography sx={{ mb: 2 }} variant="body2">
                Party/customer:
              </Typography>

              <TextField
                id="outlined-basic"
                label="Party/Customer Name"
                variant="outlined"
                name="party"
                value={filterState.party}
                onChange={onChangeFilter}
                fullWidth
                type="text"
              />
            </Card>
          </Grid>

          <Grid xs={12} sm={12}>
            <Card sx={{ p: 2 }}>
              <Typography sx={{ mb: 2 }} variant="body2">
                Order Type:
              </Typography>

              <FormControl fullWidth>
                <InputLabel id="orderType-label">Type</InputLabel>
                <Select
                  labelId="orderType-label"
                  id="orderType-select"
                  name="orderType"
                  value={filterState.orderType}
                  onChange={onChangeFilter}
                  label="Type"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="New Order">New Order</MenuItem>
                  <MenuItem value="Return">Return</MenuItem>
                </Select>
              </FormControl>
            </Card>
          </Grid>
        </Grid>
        <Card className="mt-2 mb-3" sx={{ p: 2 }}>
          <Typography sx={{ mb: 2 }} variant="body2">
            Date Range:
          </Typography>
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            <Grid xs={12} sm={6}>
              <TextField
                id="outlined-basic"
                //   label="Party/Customer Name"
                helperText="Start Date (Inclusive)"
                variant="outlined"
                name="startDate"
                value={filterState.startDate}
                onChange={onChangeFilter}
                fullWidth
                type="date"
                inputProps={{ max: new Date().toISOString().split("T")[0] }}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                id="outlined-basic"
                //   label="Party/Customer Name"
                helperText="End Date (Inclusive)"
                variant="outlined"
                name="endDate"
                value={filterState.endDate}
                onChange={onChangeFilter}
                fullWidth
                type="date"
                inputProps={{ max: new Date().toISOString().split("T")[0] }}
              />
            </Grid>
          </Grid>
        </Card>

        <Card className="mt-2 mb-3" sx={{ p: 2 }}>
          <Typography sx={{ mb: 2 }} variant="body2">
            Total Price:
          </Typography>
          <Grid container spacing={1} sx={{ justifyContent: "center" }}>
            <Grid xs={12} sm={6}>
              <TextField
                id="amount"
                label="Amount"
                name="totalPrice"
                value={filterState.totalPrice}
                onChange={onChangeFilter}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="comparison-label">Comparison</InputLabel>
                <Select
                  labelId="comparison-label"
                  id="comparison"
                  name="comparison"
                  value={filterState.comparison}
                  onChange={onChangeFilter}
                  label="Comparison"
                >
                  <MenuItem value="lessThan">Less Than</MenuItem>
                  <MenuItem value="greaterThan">Greater Than</MenuItem>
                  <MenuItem value="equalTo">Equal To</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>
        {/* <Button onClick={handleClose}>Cancel</Button> */}
        <Stack spacing={2} direction="row">
          <Button variant="contained" type="submit">
            Apply
          </Button>
          <Button onClick={toggleDrawer(false)} variant="outlined">
            Cancel
          </Button>
        </Stack>
      </DialogContent>
    </form>
  );

  return (
    <div>
      {/* <Button onClick={toggleDrawer(true)}>Open drawer</Button> */}
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        disableSwipeToOpen
      >
        {DrawerList}
      </SwipeableDrawer>
    </div>
  );
}
