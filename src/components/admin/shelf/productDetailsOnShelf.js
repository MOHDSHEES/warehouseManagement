import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Alert, Typography } from "@mui/material";

import ProductList from "../productDetails/productsList";

export default function ProductDetailsOnShelf({
  openProductDetailsOnShelf,
  setOpenProductDetailsOnShelf,
  shelfProducts,
  //   warehouseId,
  shelfClicked,
  shelfProductsUpdate,
}) {
  const handleClose = () => {
    setOpenProductDetailsOnShelf(false);
  };
  // console.log(shelfProducts);
  return (
    <React.Fragment>
      <Dialog open={openProductDetailsOnShelf} onClose={handleClose}>
        <DialogTitle>
          Product Details: {shelfClicked && shelfClicked.shelfName}
        </DialogTitle>

        <DialogContent>
          {shelfProducts !== "" && shelfProductsUpdate && "updating..."}
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}

          <div className="mt-4">
            <Typography sx={{ mb: 3 }} variant="subtitle2">
              <b>Products: </b>
            </Typography>
            {shelfProducts && shelfProducts.length > 0 ? (
              <ProductList data={shelfProducts} />
            ) : shelfProducts && shelfProducts.length === 0 ? (
              <Alert icon={false} severity="info">
                No Product Found on the Shelf.
              </Alert>
            ) : (
              <div style={{ width: "360px" }}>Loading...</div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
          {/* <Button type="submit">Ok</Button> */}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
