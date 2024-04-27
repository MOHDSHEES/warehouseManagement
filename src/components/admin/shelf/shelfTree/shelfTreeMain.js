import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import ShelfTreeView from "./shelfTree";
import { MyContext } from "@/src/components/context";
import { closeMessage } from "@/src/components/functions/message";

export default function ShelfTreeMain({ warehouseId }) {
  //   const [open, setOpen] = useState(false);
  const [shelves, setShelves] = useState(null);
  //   const [shelfClicked, setShelfClicked] = useState(null);
  //   const [loading, setLoading] = useState(false);
  const { user } = useContext(MyContext);

  //   const openAddShelf = () => {
  //     setOpen(true);
  //   };

  //   const handleClose = () => {
  //     setOpen(false);
  //   };

  useEffect(() => {
    const getShelf = async () => {
      // setLoading(true);
      try {
        const { data } = await axios.post("/api/shelf/getDetails", {
          id: warehouseId,
        });
        if (data.status === 200) {
          setShelves(data.data);
        } else if (data.status === 500) {
          closeMessage(messageApi, data.msg, "error");
        }
      } catch (error) {
        closeMessage(messageApi, "Error fetching shelves", "error");
      }
    };
    if (user && !shelves) {
      getShelf();
    }
  }, [user, shelves, warehouseId]);

  return (
    <>
      <ShelfTreeView shelfData={shelves} warehouseId={warehouseId} />
    </>
  );
}
