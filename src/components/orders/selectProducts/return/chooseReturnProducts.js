import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { debounce } from "@mui/material/utils";
import { MyContext } from "../../../context";
import axios from "axios";
import ProductTable from "../productsTable";
// import ChooseProductsForm from "./chooseProductsForm";
import { Button, Unstable_Grid2 as Grid } from "@mui/material";
import removeFields from "../../../functions/removrFieldsFromObj";
import ChooseReturnProductsForm from "./chooseReturnProductsForm";
import ReturnProductTable from "./returnProductTable";

const ChooseReturnProducts = ({ value, setValue, total, setTotal }) => {
  const { user } = useContext(MyContext);
  const [selectedValue, setSelectedValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [orderProductData, setOrderProductData] = useState(null);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    if (value && value.length) {
      const totalPrice = value.reduce((acc, item) => {
        const price =
          parseInt(item.returnQty) * parseFloat(item.item.orderData.price);
        // Convert price to a number and add it to the accumulator
        return acc + parseFloat(price);
      }, 0); // Initial value of the accumulator is 0

      setTotal(totalPrice.toFixed(2));
    }
  }, [value]);

  const fetch = React.useMemo(
    () =>
      debounce(async (request, callback) => {
        const { data } = await axios.post("/api/product/getByName", {
          data: request.input,
          company: user.company._id,
        });
        if (data.status === 200) {
          const na = options.find((option) => option.productId === "NA");
          if (na) {
            callback(data.data);
          } else callback([{ productName: "", productId: "NA" }, ...data.data]);
        }
        setLoading(false);
      }, 400),
    []
  );

  React.useEffect(() => {
    let active = true;
    if (inputValue === "") {
      setOptions(selectedValue ? [selectedValue] : []);
      return undefined;
    }

    if (
      !selectedValue ||
      inputValue.split(":-")[0] !== selectedValue.productId
    ) {
      setLoading(true);
      fetch({ input: inputValue }, (results) => {
        if (active) {
          let newOptions = [];

          if (selectedValue) {
            newOptions = [selectedValue];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [inputValue]);

  return (
    <Box>
      <form>
        <ChooseReturnProductsForm
          company={user.company._id}
          options={options}
          selectedValue={selectedValue}
          loading={loading}
          inputValue={inputValue}
          setSelectedValue={setSelectedValue}
          setInputValue={setInputValue}
          value={value}
          setValue={setValue}
          setOrderProductData={setOrderProductData}
          orderProductData={orderProductData}
        />
        {/* <Grid
          container
          spacing={2}
          sx={{ justifyContent: "center" }}
          className="mt-1 mb-3"
        >
          <Grid xs={12} sm={6}>
            <Button
              type="submit"
              // style={{ margin: "auto" }}
              // style={{ float: "right" }}
              sx={{ width: "100%" }}
              variant="outlined"
            >
              Add Product
            </Button>
          </Grid>
        </Grid> */}
      </form>
      {value && value.length > 0 && (
        // <ProductTable data={value} setValue={setValue} total={total} />
        <ReturnProductTable data={value} setValue={setValue} total={total} />
      )}
    </Box>
  );
};

export default ChooseReturnProducts;
