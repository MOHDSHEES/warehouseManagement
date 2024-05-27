import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  Box,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";

import ColorQuantityInput from "@/src/components/product/colorAdd";
import SizeQuantityInput from "@/src/components/product/sizeAdd";

const AddProductForm = ({
  productName,
  setProductName,
  productId,
  setProductId,
  quantity,
  setQuantity,
  state,
  Inputchange,
  description,
  setDescription,
  colorQuantities,
  setColorQuantities,
  submitHandler,
  disable,
  component,
}) => {
  //   console.log(productName);
  const handleKeyDown = (event) => {
    // Check if the pressed key is a dot (.)
    if (
      isNaN(Number(event.key)) &&
      event.key !== "Backspace" &&
      event.key !== "Tab"
    ) {
      event.preventDefault();
    }
    // if (
    //   event.key === "." ||
    //   event.key === "-" ||
    //   event.key.toLowerCase() === "e"
    // ) {
    //   event.preventDefault();
    // }
  };
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ mt: component === "update" ? 0 : 4, mb: 4 }}
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <fieldset disabled={disable}>
          <Box
            component="form"
            // noValidate
            onSubmit={submitHandler}
            sx={{ mt: component === "update" ? 0 : 3 }}
          >
            <Typography variant="caption" display="block" gutterBottom>
              <b>Note: </b>To add more colors or sizes, click on the &apos;ADD
              MORE COLORS OR SIZE&apos; button. For each color or sizes, please
              provide the corresponding quantity in the input field.
            </Typography>

            <Grid container spacing={2} className="mt-1 mb-3">
              <Grid item xs={12} sm={12}>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="productName"
                  name="productName"
                  label="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  // onChange={Inputchange}
                  fullWidth
                  // variant="standard"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  margin="dense"
                  autoComplete="off"
                  id="productId"
                  name="productId"
                  label="Product Id"
                  value={productId}
                  onChange={(e) =>
                    setProductId(e.target.value.trim().toUpperCase())
                  }
                  // onChange={Inputchange}
                  fullWidth
                  // variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  required
                  margin="dense"
                  autoComplete="off"
                  id="quantity"
                  name="quantity"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value.replace(/\s/g, ""))
                  }
                  // newValue.replace(/\s/g, '')
                  onKeyDown={handleKeyDown}
                  fullWidth
                  // variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Wholesale Price
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    autoComplete="off"
                    name="wholesalePrice"
                    value={state && state.wholesalePrice}
                    onChange={Inputchange}
                    startAdornment={
                      <InputAdornment position="start">£</InputAdornment>
                    }
                    label="Wholesale Price"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Retail Price
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    autoComplete="off"
                    name="retailPrice"
                    value={state && state.retailPrice}
                    onChange={Inputchange}
                    startAdornment={
                      <InputAdornment position="start">£</InputAdornment>
                    }
                    label="Retail Price"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="productDescription"
                  name="description"
                  label="Product Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  // onChange={Inputchange}
                  fullWidth
                  // variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <ColorQuantityInput
                  colorQuantities={colorQuantities ? colorQuantities : []}
                  setColorQuantities={setColorQuantities}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <SizeQuantityInput
                  sizeQuantities={sizeQuantities ? sizeQuantities : []}
                  setSizeQuantities={setSizeQuantities}
                />
              </Grid> */}
            </Grid>

            <Button disabled={disable} type="submit" variant="contained">
              {component === "update" ? "Update" : "Add Product"}
            </Button>
          </Box>
        </fieldset>
      </Container>
    </>
  );
};

export default AddProductForm;
