import React, { useEffect, useMemo, useState } from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import ShelfSearch from "../../search/shelfSearch";
import axios from "axios";
import { Typography, debounce } from "@mui/material";

export default function ShelfSearchModel({ open, setOpen, warehouse }) {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [state, setState] = useState({});

  const fetch = useMemo(
    () =>
      debounce(async (request, callback) => {
        const { data } = await axios.post("/api/shelf/find", {
          data: request.input,
          warehouse: warehouse,
        });
        console.log(data);
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

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog style={{ minWidth: "400px" }} size="lg">
          <DialogTitle>Search Shelf</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              Begin typing shelf Name to find a matching shelf.
            </Typography>
          </DialogContent>
          {/* <form
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
            }}
          > */}
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
            <Button type="submit">Search</Button>
          </Stack>
          {/* </form> */}
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
