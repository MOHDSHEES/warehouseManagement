import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";
import { Unstable_Grid2 as Grid, InputAdornment } from "@mui/material";

export default function ShelfSearch({
  options,
  selectedValue,
  loading,
  inputValue,
  setSelectedValue,
  setInputValue,
}) {
  return (
    <>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Autocomplete
          //   multiple
          id="product"
          sx={{ width: "100%" }}
          getOptionLabel={(option) =>
            typeof option === "string"
              ? option
              : `${option.shelfName} (${
                  option.shelfPath && option.shelfPath.length === 1
                    ? "Parent Shelf"
                    : option.shelfPath && option.shelfPath.length > 0
                    ? option.shelfPath.join(" > ")
                    : "-"
                })`
          }
          //   filterOptions={(x) => x}
          options={options}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={selectedValue}
          noOptionsText={
            loading
              ? "Loading..."
              : !options.length && inputValue
              ? "No shelf found"
              : "Start Typing shelf Name"
          }
          onChange={(event, newValue) => {
            setSelectedValue(newValue);
            // if (newValue && newValue.retailPrice) {
            //   const discount = parseFloat(state.discount);
            //   const price =
            //     newValue.retailPrice - newValue.retailPrice * (discount / 100);
            //   setState({
            //     ...state,
            //     price: price,
            //     comment: "",
            //     shelf: "",
            //   });
            // } else setState({ ...state, price: 1, comment: "", shelf: "" });
            // setSelectedShelf("");
            // setState({ ...state, comment: "", shelf: "" });
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Choose Shelf" fullWidth required />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option._id}>
                <Grid container alignItems="center">
                  <Grid
                    sx={{
                      wordWrap: "break-word",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {`${option.shelfName} (${
                        option.shelfPath && option.shelfPath.length === 1
                          ? "Parent Shelf"
                          : option.shelfPath && option.shelfPath.length > 0
                          ? option.shelfPath.join(" > ")
                          : "-"
                      })`}
                    </Typography>
                  </Grid>
                </Grid>
              </li>
            );
          }}
        />
      </Stack>
    </>
  );
}
