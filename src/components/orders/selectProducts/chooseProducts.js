import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { debounce } from "@mui/material/utils";
import { MyContext } from "../../context";
import axios from "axios";
import ProductTable from "./productsTable";
import ChooseProductsForm from "./chooseProductsForm";
import { Button, Unstable_Grid2 as Grid } from "@mui/material";
import removeFields from "../../functions/removrFieldsFromObj";

// function remove() {
//   const mergedData = removeDuplicate(value);
//   setValue(mergedData);
// }
// function removeDuplicate(data) {
//   const mergedOrderData = {};
//   const array = data;

//   // Iterate over the array of items
//   array.forEach((item) => {
//     // Generate a unique key for each item based on productId, productName, discount, and price
//     const key = `${item.productId}-${item.productName}-${item.orderData.discount}-${item.orderData.price}`;
//     // Convert orderData.qty to an integer
//     const quantity = parseInt(item.orderData.qty, 10);
//     // Check if the key already exists in the mergedOrderData
//     if (mergedOrderData[key]) {
//       // If the key exists, add the quantity of the existing item
//       mergedOrderData[key].orderData.qty += quantity;
//     } else {
//       // If the key doesn't exist, add the item to the mergedOrderData
//       mergedOrderData[key] = { ...item };
//       // Set orderData.qty to the integer value
//       mergedOrderData[key].orderData.qty = quantity;
//     }
//   });

//   // Convert the mergedOrderData object back to an array of items
//   const mergedOrderDataArray = Object.values(mergedOrderData);
//   return mergedOrderDataArray;
// }

const ChooseProducts = ({ value, setValue, total, setTotal }) => {
  const { user } = useContext(MyContext);
  const [selectedValue, setSelectedValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [newName, setNewName] = useState("");
  const [state, setState] = useState({
    discount: 0,
    qty: 1,
    price: 1,
    comment: "",
    shelf: "",
  });

  // const [selectedShelf, setSelectedShelf] = useState("");
  // const [discount, setDiscount] = useState(0);

  const [options, setOptions] = useState([]);
  useEffect(() => {
    if (value && value.length) {
      const totalPrice = value.reduce((acc, item) => {
        const price =
          parseInt(item.orderData.qty) * parseFloat(item.orderData.price);
        // Convert price to a number and add it to the accumulator
        return (
          acc + parseFloat(price)
          // parseFloat(
          //   price - (price * parseFloat(item.orderData.discount)) / 100
          // )
        );
      }, 0); // Initial value of the accumulator is 0

      setTotal(totalPrice.toFixed(2));
    }
  }, [value]);

  const Inputchange = (event) => {
    // setValidated(false);
    const { name, value } = event.target;
    if (name === "shelf" || name === "comment")
      setState({
        ...state,
        [name]: value,
      });
    else if (value === "")
      setState({
        ...state,
        [name]: 0,
      });
    else {
      if (name === "qty")
        setState({
          ...state,
          [name]: parseInt(value.trim()),
        });
      else
        setState({
          ...state,
          [name]: parseFloat(value.trim()),
        });
    }
  };
  const inputPriceChangeHandler = (event) => {
    // setValidated(false);
    const { name, value } = event.target;
    if (name === "price") {
      const newPrice = parseFloat(value.trim());
      const retailPrice = parseFloat(selectedValue.retailPrice);
      const newDiscount = ((retailPrice - newPrice) / retailPrice) * 100;
      setState({
        ...state,
        [name]: value.trim(),
        discount: newDiscount.toFixed(2),
      });
    } else {
      const newDiscount = parseFloat(value.trim());
      const retailPrice = parseFloat(selectedValue.retailPrice);
      const newPrice = retailPrice - retailPrice * (newDiscount / 100);
      setState({
        ...state,
        [name]: value.trim(),
        price: newPrice.toFixed(2),
      });
    }
  };

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

  function handleItem(e) {
    e.preventDefault();
    if (selectedValue && selectedValue.productId !== "NA") {
      const itemToUpdate = value.find(
        (item) =>
          item._id === selectedValue._id &&
          state.shelf.color === item.orderData.shelf.color
        // &&
        // state.shelf.size === item.orderData.shelf.size
      );

      if (itemToUpdate) {
        const updatedValue = value.map((item) => {
          if (
            item._id === selectedValue._id &&
            state.shelf.color === item.orderData.shelf.color
            // &&
            // state.shelf.size === item.orderData.shelf.size
          ) {
            return {
              ...item,
              orderData: {
                ...item.orderData,
                qty: (
                  parseInt(state.qty) + parseInt(itemToUpdate.orderData.qty)
                ).toString(),
              },
            };
          } else {
            return item;
          }
        });

        setValue(updatedValue);
        setState({ ...state, qty: 1, comment: "", shelf: "" });
        // setQty(1);
        // setComment("");
        // setSelectedShelf("");
        return null;
      }
    } else {
      // console.log(selectedValue);
      const newValue = {
        ...selectedValue,
        productName: newName,
        ...{
          orderData: state,
        },
      };
      setValue([...value, newValue]);

      setState({ ...state, qty: 1, comment: "", shelf: "" });
      return null;
    }
    const filteredValues = removeFields(selectedValue, [
      "color",
      "quantity",
      "shelves",
      "__v",
      "wholesalePrice",
      "company",
    ]);

    // console.log(state);
    const newValue = {
      // ...selectedValue,
      ...filteredValues,
      // productName: newName,
      ...{
        // orderData: state,
        orderData: {
          ...state,
          shelf: {
            color: state.shelf.color,
            shelf: {
              _id:
                state.shelf.shelf && state.shelf.shelf._id
                  ? state.shelf.shelf._id
                  : null,
            },
          },
        },
      },
    };
    setValue([...value, newValue]);

    setState({ ...state, qty: 1, comment: "", shelf: "" });
    // setQty(1);
    // setComment("");
    // setSelectedShelf("");
  }

  return (
    <Box>
      <form onSubmit={handleItem}>
        <ChooseProductsForm
          options={options}
          selectedValue={selectedValue}
          loading={loading}
          inputValue={inputValue}
          setSelectedValue={setSelectedValue}
          setInputValue={setInputValue}
          Inputchange={Inputchange}
          state={state}
          setState={setState}
          newName={newName}
          setNewName={setNewName}
          inputPriceChangeHandler={inputPriceChangeHandler}
        />
        <Grid
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
        </Grid>
      </form>

      {value && value.length > 0 && (
        <ProductTable data={value} setValue={setValue} total={total} />
      )}
    </Box>
  );
};

export default ChooseProducts;
