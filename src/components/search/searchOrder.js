import { useContext, useState } from "react";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { FormControl, IconButton, OutlinedInput } from "@mui/material";
import { MyContext } from "../context";
import { closeMessage, openMessage } from "../functions/message";
import OrderDetailsModel from "../orders/ordersList/orderDetailsModel";

export default function SearchOrder() {
  const [searchInput, setSearchInput] = useState("");
  const { user, messageApi } = useContext(MyContext);
  const [open, setOpen] = useState(false);
  const [searchedData, setSearchedData] = useState("");

  async function search(e) {
    e.preventDefault();
    if (searchInput) {
      getSearchedOrder();
      //   setOpen(true);
      setSearchInput("");
    }
  }

  async function getSearchedOrder() {
    openMessage(messageApi, "Searching...");
    const { data } = await axios.post("/api/order/getSearchedOrder", {
      company: user.company._id,
      orderId: searchInput.trim(),
    });
    if (data.status === 200) {
      setSearchedData(data.data);
      messageApi.destroy();
      setOpen(true);
    } else closeMessage(messageApi, data.msg, "error");
  }

  return (
    <>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <form onSubmit={search}>
          <FormControl sx={{ m: 1 }} variant="outlined">
            <OutlinedInput
              id="order-search"
              required
              placeholder="Search with Order Id"
              sx={{
                background: "white",
                width: 350,
                [`@media (max-width: 425px)`]: {
                  width: 250,
                },
              }}
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    //   onClick={search}
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
              // label="Password"
            />
          </FormControl>
        </form>
        <OrderDetailsModel
          open={open}
          setOpen={setOpen}
          selectedOrder={searchedData}
          setSelectedOrder={setSearchedData}
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
