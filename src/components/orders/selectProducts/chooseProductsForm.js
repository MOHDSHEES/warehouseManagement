import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Unstable_Grid2 as Grid,
  InputAdornment,
} from "@mui/material";

const ChooseProductsForm = ({
  options,
  selectedValue,
  loading,
  inputValue,
  setSelectedValue,
  // setSelectedShelf,
  inputPriceChangeHandler,
  Inputchange,
  setState,
  state,
  setInputValue,
  component = null,
  newName = "",
  setNewName = "",
  retailPrice = "0",
}) => {
  const highlightMatch = (text, query) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span style={{ fontWeight: "bold", color: "red" }}>
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    );
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ justifyContent: "center" }}
      className="mt-1 mb-3"
    >
      <Grid xs={12} sm={6}>
        <Autocomplete
          id="product"
          sx={{ width: "100%" }}
          getOptionLabel={(option) =>
            typeof option === "string"
              ? option
              : option.productId === "NA"
              ? option.productId
              : `${option.productId}:- ${option.productName}`
          }
          filterOptions={(x) => x}
          options={options}
          autoComplete
          disabled={component && component === "update" && true}
          includeInputInList
          filterSelectedOptions
          value={selectedValue}
          noOptionsText={
            loading
              ? "Loading..."
              : !options.length && inputValue
              ? "No product found"
              : "Start Typing product Name/Id..."
          }
          onChange={(event, newValue) => {
            setSelectedValue(newValue);
            if (newValue && newValue.retailPrice) {
              const discount = parseFloat(state.discount);
              const price =
                newValue.retailPrice - newValue.retailPrice * (discount / 100);
              setState({
                ...state,
                price: price,
                comment: "",
                shelf: "",
              });
            } else setState({ ...state, price: 1, comment: "", shelf: "" });
            // setSelectedShelf("");
            // setState({ ...state, comment: "", shelf: "" });
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Choose Product" fullWidth required />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.productId}>
                <Grid container alignItems="center">
                  <Grid
                    sx={{
                      wordWrap: "break-word",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      <b>
                        {option.productId === "NA"
                          ? option.productId
                          : option.productId + ":- "}
                      </b>
                      {highlightMatch(option.productName, inputValue)}
                    </Typography>
                  </Grid>
                </Grid>
              </li>
            );
          }}
        />
      </Grid>
      <Grid xs={6} sm={2}>
        <TextField
          id="order-qty"
          name="qty"
          onChange={Inputchange}
          value={state.qty}
          required
          fullWidth
          label="Qty"
          variant="outlined"
        />
      </Grid>
      {selectedValue && (
        <Grid xs={6} sm={2}>
          <TextField
            id="order-original-price"
            name="originalPrice"
            // onChange={Inputchange}
            value={
              component === "update"
                ? retailPrice
                : selectedValue.retailPrice
                ? selectedValue.retailPrice
                : "0"
            }
            // required
            fullWidth
            label="Retail Price"
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </Grid>
      )}
      {selectedValue && (
        <Grid xs={6} sm={2}>
          <TextField
            id="order-price"
            name="price"
            onChange={inputPriceChangeHandler}
            value={state.price}
            required
            fullWidth
            label="Selling Price"
            variant="outlined"
          />
        </Grid>
      )}
      {selectedValue && selectedValue.productId === "NA" && (
        <Grid xs={12} sm={4}>
          <TextField
            id="New-product-comment"
            label="New Product Name"
            fullWidth
            multiline
            name="newProductName"
            maxRows={4}
            onChange={(e) => setNewName(e.target.value)}
            value={newName}
          />
        </Grid>
      )}
      {selectedValue && (
        <Grid xs={6} sm={2}>
          <TextField
            id="order-discount"
            name="discount"
            onChange={inputPriceChangeHandler}
            value={state.discount}
            required
            fullWidth
            label="Discount"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            variant="outlined"
          />
        </Grid>
      )}
      {selectedValue &&
        selectedValue.shelves &&
        selectedValue.shelves.length > 0 && (
          <Grid xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="order-shelf">From Shelf</InputLabel>
              <Select
                labelId="order-shelf"
                id="shelf"
                name="shelf"
                required
                value={state.shelf}
                label="From Shelf"
                onChange={Inputchange}
              >
                <MenuItem value="Other">Other</MenuItem>
                {selectedValue.shelves.map((shelf, idx) => {
                  const shelfValue =
                    shelf.shelf.shelfPath.join(" > ") +
                    " (" +
                    shelf.quantity +
                    ", " +
                    shelf.color +
                    ", " +
                    shelf.size +
                    ")";
                  return (
                    <MenuItem key={shelf.shelf._id + idx} value={shelf}>
                      {shelf.shelf.shelfPath && shelf.shelf.shelfPath.length > 0
                        ? shelfValue
                        : "-"}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        )}

      {selectedValue && (
        <Grid xs={12} sm={6}>
          <TextField
            id="order-comment"
            label="Additional Comment"
            fullWidth
            multiline
            name="comment"
            maxRows={4}
            onChange={Inputchange}
            value={state.comment}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default ChooseProductsForm;
