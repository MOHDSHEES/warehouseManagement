import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

const Variant = ({ selectedProductDetails, setState, state }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="variant">Variant</InputLabel>
      <Select
        labelId="variant"
        id="variant-"
        name="variant"
        required
        label="Variant"
        value={state.shelf.color ? state.shelf.color : ""}
        onChange={(e) =>
          setState({ ...state, shelf: { color: e.target.value } })
        }
      >
        {/* <TextField
      margin="dense"
      id="variant"
      name="color"
      select
      label="Variant"
      value={color}
      onChange={(e) => setColor(e.target.value)}
      fullWidth
      // variant="standard"
    > */}
        {selectedProductDetails && selectedProductDetails.color.length > 0 ? (
          [
            <MenuItem key="mix" value="Mix">
              Mix
            </MenuItem>,
            ...selectedProductDetails.color.map((option, id) => (
              <MenuItem
                key={id}
                value={
                  "color: " +
                  (option.color ? option.color : "-") +
                  ", Size: " +
                  (option.size ? option.size : "-")
                }
              >
                color: {option.color ? option.color : "-"}, size:{" "}
                {option.size ? option.size : "-"}
              </MenuItem>
            )),
          ]
        ) : selectedProductDetails &&
          selectedProductDetails.color.length === 0 ? (
          <MenuItem value="">No Colors available for this item</MenuItem>
        ) : (
          <MenuItem value="">Loading...</MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default Variant;
