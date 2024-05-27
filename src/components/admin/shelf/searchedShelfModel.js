import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import ShelfTreeView from "./shelfTree/shelfTree";
import {
  Box,
  Card,
  CardHeader,
  Container,
  Unstable_Grid2 as Grid,
} from "@mui/material";

export default function SearchedShelfModel({
  open,
  setOpen,
  shelf,
  warehouse,
}) {
  const handleClose = (value) => {
    setOpen(false);
    // setSelectedValue(value);
  };

  return (
    <>
      <Dialog fullWidth={true} maxWidth="md" onClose={handleClose} open={open}>
        <DialogTitle>Shelf Details:</DialogTitle>
        {/* <Container maxWidth="xl" sx={{ mt: 1, mb: 4, padding: 0 }}> */}
        {/* <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 3,
            }}
          > */}
        <Grid item xs={12} md={6} lg={6}>
          <Card sx={{ p: 2 }}>
            <ShelfTreeView shelfData={[shelf]} warehouseId={warehouse} />
          </Card>
        </Grid>
        {/* </Box> */}
        {/* </Container> */}
      </Dialog>
    </>
  );
}
