import react, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { IconButton, InputBase, Paper } from "@mui/material";
import ProductDetails from "../admin/productDetails/productDetails";
import { MyContext } from "../context";
import { closeMessage } from "../functions/message";

export default function SearchProduct({ warehouse, pathName }) {
  const [searchInput, setSearchInput] = useState("");
  const { productIds, setProductIds, messageApi } = useContext(MyContext);
  const [openProductDetails, setOpenProductDetails] = useState(false);
  const [searchedData, setSearchedData] = useState("");
  const [searchData, setSearchData] = useState([
    { productId: "Loading Data...", productName: "", disabled: true },
  ]);
  //   console.log(searchInput);
  //   console.log(productIds);
  //   console.log(searchData);
  async function search() {
    if (searchInput) {
      getSearchedProduct(searchInput);
      setOpenProductDetails(true);
      setSearchInput("");
    }
  }

  async function getSearchedProduct(productId) {
    // console.log(productId.split(":")[0].trim());
    const { data } = await axios.post("/api/product/getSearchedProduct", {
      warehouse: warehouse,
      productId: productId.label.split(":")[0].trim(),
    });
    if (data.status === 200) setSearchedData(data.data);
    else closeMessage(messageApi, data.msg, "error");
    // console.log(data);
  }

  const getSearchData = () => {
    // Update the search input state
    // setSearchInput(newInputValue);
    flag = 0;
    axios
      .post("/api/product/search", { warehouse: warehouse })
      .then((response) => {
        // Handle the response data as needed
        if (response.data.status === 200) {
          setProductIds([
            ...productIds,
            { warehouseId: warehouse, productIds: response.data.data },
          ]);
          if (response.data.data && response.data.data.length > 0)
            setSearchData(response.data.data);
          else
            setSearchData([
              {
                productId: "No product found.",
                productName: "",
                disabled: true,
              },
            ]);
        } else if (response.data.status === 500) {
          closeMessage(messageApi, response.data.msg, "error");
        }
        // console.log(response.data);
      })
      .catch((error) => {
        closeMessage(messageApi, error, "error");
      });
  };

  let flag = 1;
  useEffect(() => {
    // getSearchData();

    if (flag) {
      const filteredItem = productIds.find(
        (item) => item.warehouseId === warehouse
      );

      if (filteredItem) {
        setSearchData(filteredItem.productIds);
      } else getSearchData();
    }
  }, [warehouse]);
  const handleFormSubmit = (event) => {
    event.preventDefault();
    search();
  };

  useEffect(() => {
    // console.log(pathName);
    setOpenProductDetails(false);
  }, [pathName]);
  return (
    <>
      <Stack spacing={2} sx={{ width: "100%" }}>
        {/* <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={top100Films.map((option) => option.title)}
        renderInput={(params) => <TextField {...params} label="freeSolo" />}
      /> */}
        <Autocomplete
          freeSolo
          sx={{
            background: "white",
            width: 350,
            [`@media (max-width: 425px)`]: {
              width: 250,
            },
            // [`@media (min-width: 900px)`]: {
            //   width: "60%", // Adjust width for screens wider than 900px
            // },
          }}
          id="free-solo-2-demo"
          disableClearable
          options={searchData.map((option) => ({
            label:
              (option.productId && option.productId) +
              (option.productName && ": " + option.productName),
            disabled: option.disabled,
          }))}
          onChange={(event, selectedOption) => {
            if (!selectedOption.disabled) setSearchInput(selectedOption);
          }}
          getOptionDisabled={(option) => option.disabled}
          onInputChange={(event, newInputValue) => {
            // Reset searchInput when the user starts typing
            if (newInputValue && searchInput !== newInputValue) {
              setSearchInput("");
            }
          }}
          value={searchInput}
          renderInput={(params) => (
            <Paper
              ref={params.InputProps.ref}
              onSubmit={handleFormSubmit}
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                //   width: 400,
              }}
            >
              <InputBase
                {...params.inputProps}
                sx={{ ml: 1, flex: 1 }}
                size="small"
                placeholder="Search products with Id or Name"
                inputProps={{ "aria-label": "search products with Id or Name" }}
              />
              <IconButton
                onClick={search}
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          )}
        />
        <ProductDetails
          openProductDetails={openProductDetails}
          setOpenProductDetails={setOpenProductDetails}
          searchedData={searchedData}
          setSearchedData={setSearchedData}
          warehouse={warehouse}
        />
      </Stack>
    </>
  );
}
//   <TextField
//     {...params}
//     label="Search product"
//     size="small"
//     InputProps={{
//       ...params.InputProps,
//       type: "search",
//       endAdornment: (
//         <InputAdornment position="end">
//           <SearchIcon />
//         </InputAdornment>
//       ),
//     }}
//   />
