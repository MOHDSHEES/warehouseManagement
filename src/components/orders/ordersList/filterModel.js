import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  TextField,
  Unstable_Grid2 as Grid,
  Card,
  CardHeader,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

export default function FilterModel({
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

  const handleClose = () => {
    setFilterState(filter);
    setOpen(false);
  };
  useEffect(() => {
    setFilterState(filter);
  }, [filter]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth={true}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            setFilter(filterState);
            getFilteredOrders(filterState);
            // handleClose();
          },
        }}
      >
        <DialogTitle>Filter Orders</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Customize your search by applying one or more filters.
          </DialogContentText>
          <Grid
            container
            spacing={2}
            sx={{ justifyContent: "center" }}
            className="mt-2 mb-3"
          >
            <Grid xs={12} sm={6}>
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

            <Grid xs={12} sm={6}>
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
                    label="Age"
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
              <Grid xs={12} sm={9}>
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
              <Grid xs={12} sm={3}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Apply</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
