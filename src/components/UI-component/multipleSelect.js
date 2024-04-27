import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { FormHelperText } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelect({
  options,
  value,
  setValue,
  error,
  setError,
}) {
  //   const [personName, setPersonName] = React.useState([]);
  //   console.log(value);
  const handleChange = (event) => {
    setError(false);
    const {
      target: { value },
    } = event;
    setValue(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    if (value.length === 0) setError(true);
  };

  return (
    <>
      {/* <FormControl sx={{ m: 1, width: 300 }}> */}
      {/* <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel> */}
      <Select
        sx={{ width: "100%" }}
        id="demo-multiple-checkbox"
        multiple
        size="small"
        error={error}
        value={value}
        required
        displayEmpty
        onChange={handleChange}
        // input={<OutlinedInput label="Tag" />}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        {value[0] === "loading..." ? (
          <MenuItem value="">
            <ListItemText primary="Loading..." />
          </MenuItem>
        ) : options && options.length > 0 ? (
          options.map((option) => (
            <MenuItem key={option.warehouseName} value={option.warehouseName}>
              <Checkbox checked={value.indexOf(option.warehouseName) > -1} />
              <ListItemText primary={option.warehouseName} />
            </MenuItem>
          ))
        ) : (
          <MenuItem value="">
            <ListItemText primary="No warehouse found..." />
          </MenuItem>
        )}
      </Select>
      {error && (
        <FormHelperText sx={{ color: "red" }}>
          Please choose one or more warehouses
        </FormHelperText>
      )}
      {/*  </FormControl> */}
    </>
  );
}
