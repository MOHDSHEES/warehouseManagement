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
import Variant from "../variant";
import axios from "axios";
import SelectReturnFromOrder from "./selectReturnFromOrder";
import { MyContext } from "@/src/components/context";

const ChooseReturnProductsForm = ({
  options,
  selectedValue,
  loading,
  inputValue,
  setSelectedValue,
  setInputValue,
  component = null,
  company,
  setOrderProductData,
  orderProductData,
  value,
  setValue,
}) => {
  const [open, setOpen] = useState(false);
  const { messageApi } = useContext(MyContext);
  const [orderLoading, setOrderLoading] = useState(false);
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

  async function findProductInOrder(value) {
    setOrderLoading(true);
    const { data } = await axios.post("/api/product/findProductInOrder", {
      productId: value.productId,
      companyId: company,
    });
    if (data && data.status === 200) {
      //   setOrderProductData({ ...value, orderData: data.data.product.orderData });
      setOrderProductData(data.data);
      //   setState(data.data.product.orderData);
    }
    setOrderLoading(false);
    //   setSelectedValue({ ...value, orderData: data.data.product.orderData });
    // console.log(data);
  }

  //   console.log(selectedValue);
  // console.log(orderProductData);
  return (
    <>
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
              setOrderProductData(null);
              if (newValue && newValue.productId) {
                setOpen(true);
                findProductInOrder(newValue);
              }
              // setSelectedValue(newValue);
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
              <TextField
                {...params}
                label="Choose Product"
                fullWidth
                required
              />
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
      </Grid>
      <SelectReturnFromOrder
        open={open}
        setOpen={setOpen}
        data={orderProductData}
        orderLoading={orderLoading}
        value={value}
        setValue={setValue}
        messageApi={messageApi}
      />
    </>
  );
};

export default ChooseReturnProductsForm;
