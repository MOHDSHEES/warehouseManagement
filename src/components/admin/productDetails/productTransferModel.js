import React, { useContext, useEffect, useMemo, useState } from "react";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import ShelfSearch from "../../search/shelfSearch";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  debounce,
} from "@mui/material";
import { closeMessage, openMessage } from "../../functions/message";
import { MyContext } from "../../context";

export default function ProductTransferModel({
  open,
  setOpen,
  warehouse,
  selectedRow,
  updateProducts,
}) {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [state, setState] = useState({});
  const { messageApi } = useContext(MyContext);
  const [disabled, setDisabled] = useState(false);

  //   console.log(selectedRow);
  //   console.log(selectedValue);
  const fetch = useMemo(
    () =>
      debounce(async (request, callback) => {
        const { data } = await axios.post("/api/shelf/find", {
          data: request.input,
          warehouse: warehouse,
          onlyRoot: true,
        });
        // console.log(data);
        if (data.status === 200) {
          callback(data.data);
        }
        setLoading(false);
      }, 400),
    []
  );

  useEffect(() => {
    let active = true;
    if (inputValue === "") {
      setOptions(selectedValue ? [selectedValue] : []);
      return undefined;
    }
    if (!selectedValue) {
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

  async function search(e) {
    e.preventDefault();
    setDisabled(true);
    openMessage(messageApi, "Transfering...");
    const { data } = await axios.post("/api/product/transfer", {
      to: selectedValue._id,
      from: {
        shelfId: selectedRow.shelfId,
        color: selectedRow.color === "-" ? "" : selectedRow.color,
        productId: selectedRow.productId,
      },
      warehouse: warehouse,
      qty: selectedRow.quantity,
    });
    if (data.status === 200) {
      closeMessage(messageApi, "Transfer successfull", "success");
      setOpen(false);
      updateProducts();
    } else if (data.msg) closeMessage(messageApi, data.msg, "error");
    // if (selectedValue && selectedValue._id) {
    //   setOpen(false);
    setDisabled(false);
    // }
  }

  return (
    <React.Fragment>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Transfer To:</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Begin typing shelf Name to find a matching shelf.
          </Typography>

          {/* <form
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
            }}
          > */}
          <fieldset disabled={disabled}>
            <form onSubmit={search}>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <ShelfSearch
                  options={options}
                  selectedValue={selectedValue}
                  loading={loading}
                  inputValue={inputValue}
                  setSelectedValue={setSelectedValue}
                  setInputValue={setInputValue}
                  //  Inputchange={Inputchange}
                  state={state}
                  setState={setState}
                />
                <Button type="submit">
                  {disabled ? "Transfering..." : "Transfer"}
                </Button>
              </Stack>
            </form>
          </fieldset>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
