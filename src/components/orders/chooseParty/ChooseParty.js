import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
// import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import { MyContext } from "../../context";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Unstable_Grid2 as Grid,
  MenuItem,
  Select,
} from "@mui/material";

export default function ChooseParty({
  value,
  setValue,
  inputValue,
  setInputValue,
  setOrderType,
  orderType,
}) {
  const { user } = useContext(MyContext);

  //   const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  //   const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const fetch = React.useMemo(
    () =>
      debounce(async (request, callback) => {
        const { data } = await axios.post("/api/customer/getByName", {
          data: request.input,
          company: user.company._id,
        });
        if (data.status === 200) callback(data.data);
        setLoading(false);
      }, 400),
    []
  );

  React.useEffect(() => {
    let active = true;
    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }
    setLoading(true);
    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue]);

  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: "center" }}
        className="mt-1 mb-3"
      >
        <Grid xs={12} sm={6}>
          <Autocomplete
            id="chooseParty"
            sx={{ width: "100%" }}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText={
              loading
                ? "Loading..."
                : !options.length && inputValue
                ? "No Customers/Party found"
                : "Start Typing Party Name..."
            }
            onChange={(event, newValue) => {
              setOptions(newValue ? [newValue, ...options] : options);
              setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Choose Party/Customer" fullWidth />
            )}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.name}>
                  <Grid container alignItems="center">
                    <Grid
                      sx={{
                        wordWrap: "break-word",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {option.name}
                      </Typography>
                    </Grid>
                  </Grid>
                </li>
              );
            }}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="payment-method">Type of Order</InputLabel>
            <Select
              size="medium"
              //   defaultValue={"Full"}
              name="orderType"
              labelId="orderType"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              label="Type of Order"
            >
              <MenuItem value={"New Order"}>New Order</MenuItem>
              <MenuItem value={"Return"}>Return</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {value && <CustomerDetail data={value} />}
    </Box>
  );
}

function CustomerDetail({ data }) {
  return (
    // <Card sx={{ p: 2 }}>
    //   <CardHeader title="Customer Details" />
    <CardContent sx={{ pt: 0, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Customer Details
      </Typography>
      <Grid container spacing={2} className="mt-1 mb-3">
        <Grid xs={12} sm={4}>
          <TextField
            autoFocus
            required
            margin="dense"
            InputProps={{
              readOnly: true,
            }}
            id="name"
            name="name"
            label="Customer Name"
            value={data.name}
            fullWidth
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="customerType"
            InputProps={{
              readOnly: true,
            }}
            name="customerType"
            label="Customer Type"
            value={data.customerType}
            fullWidth
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="email"
            InputProps={{
              readOnly: true,
            }}
            name="email"
            label="Email"
            value={data.email}
            fullWidth
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="mobileNo"
            InputProps={{
              readOnly: true,
            }}
            name="mobileNo"
            label="Mobile No"
            value={data.mobileNo}
            fullWidth
          />
        </Grid>
        <Grid xs={12} sm={8}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="address"
            name="address"
            label="Address"
            InputProps={{
              readOnly: true,
            }}
            value={data.address}
            fullWidth
          />
        </Grid>
      </Grid>
    </CardContent>
    //   </Card>
  );
}
