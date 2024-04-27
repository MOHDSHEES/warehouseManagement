import React from "react";
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  InputAdornment,
  FilledInput,
  Alert,
} from "@mui/material";

const TableTop = ({ searchedData }) => {
  const loading = "loading...";
  const {
    productName = loading,
    productId = loading,
    quantity = loading,
    wholesalePrice = loading,
    retailPrice = loading,
    color = "",
    size = "",
  } = searchedData || {};

  return (
    <div>
      <fieldset disabled={true}>
        <Grid container spacing={2} className="mt-1">
          <Grid item xs={12} sm={12}>
            <TextField
              // autoFocus
              // required
              //   margin="dense"
              id="productName"
              name="productName"
              label="Product Name"
              value={productName}
              variant="filled"
              size="small"
              // onChange={Inputchange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              // autoFocus
              // required
              //   margin="dense"
              //   id="productName"
              //   name="productName"
              label="Product Id"
              value={productId}
              variant="filled"
              size="small"
              // onChange={Inputchange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              // autoFocus
              // required
              //   margin="dense"
              variant="filled"
              //   id="productName"
              //   name="productName"
              label="Quantity"
              value={quantity}
              size="small"
              // onChange={Inputchange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="filled">
              <InputLabel htmlFor="filled-adornment-amount">
                Wholesale Price
              </InputLabel>
              <FilledInput
                id="filled-adornment-amount"
                size="small"
                value={wholesalePrice}
                startAdornment={
                  <InputAdornment position="start">£</InputAdornment>
                }
                label="Wholesale Price"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="filled">
              <InputLabel>Retail Price</InputLabel>
              <FilledInput
                // id="filled-adornment-amount"
                size="small"
                value={retailPrice}
                startAdornment={
                  <InputAdornment position="start">£</InputAdornment>
                }
                label="Retail Price"
              />
            </FormControl>
          </Grid>
        </Grid>
      </fieldset>

      <Grid container sx={{ mt: 3 }} spacing={2}>
        <Grid item xs={12} sm={12}>
          <Typography variant="subtitle2">
            <b>Variant: </b>
          </Typography>
          <Table>
            <TableBody>
              {color === "" ? (
                "Loading..."
              ) : color.length > 0 ? (
                <TableRow>
                  <Grid container spacing={2} className="mt-1">
                    {color.map((color, index) => (
                      <Grid
                        key={index}
                        style={{ padding: 0, paddingLeft: "10px" }}
                        item
                        xs={12}
                        sm={6}
                        xl={4}
                      >
                        <TableCell>
                          <b className="color">Color: </b>
                          {color.color ? color.color : "-"}, <b>Qty: </b>
                          {color.quantity}, <b>Size: </b>
                          {color.size ? color.size : "-"}
                        </TableCell>
                      </Grid>
                    ))}
                  </Grid>
                </TableRow>
              ) : (
                <Alert icon={false} severity="info">
                  No colors or sizes available for this product.
                </Alert>
              )}
            </TableBody>
          </Table>
        </Grid>

        {/* <Grid item xs={12} sx={{ mt: 2 }} sm={12}>
          <Typography variant="subtitle2">
            <b>Sizes: </b>
          </Typography>
          <Table>
            <TableBody>
              {size === "" ? (
                "Loading..."
              ) : size.length > 0 ? (
                <TableRow>
                  <Grid container spacing={2} className="mt-1">
                    {size.map((size, index) => (
                      <Grid
                        key={index}
                        style={{ padding: 0, paddingLeft: "10px" }}
                        item
                        xs={12}
                        sm={6}
                        xl={4}
                      >
                        <TableCell>
                          <b>size: </b> {size.size}, <b>Quantity: </b>{" "}
                          {size.quantity}
                        </TableCell>
                      </Grid>
                    ))}
                  </Grid>
                </TableRow>
              ) : (
                <Alert icon={false} severity="info">
                  No Sizes available for this product.
                </Alert>
              )}
            </TableBody>
          </Table>
        </Grid> */}
      </Grid>
    </div>
  );
};

export default TableTop;
