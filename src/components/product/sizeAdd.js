import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MyContext } from "../context";
import { closeMessage } from "../functions/message";

const SizeQuantityInput = ({ sizeQuantities, setSizeQuantities }) => {
  const { messageApi } = useContext(MyContext);
  //   console.log(sizeQuantities);
  //   console.log(sizeQuantities);

  const handleSizeChange = (index, value) => {
    const updatedsizeQuantities = [...sizeQuantities];
    updatedsizeQuantities[index].size = value;
    setSizeQuantities(updatedsizeQuantities);
  };

  const handleQuantityChange = (index, value) => {
    const updatedsizeQuantities = [...sizeQuantities];
    updatedsizeQuantities[index].quantity = value;
    setSizeQuantities(updatedsizeQuantities);
  };

  const addColor = () => {
    // setsizeQuantities([...sizeQuantities, { color: "", quantity: 0 }]);
    const lastEntry = sizeQuantities[sizeQuantities.length - 1];
    if (lastEntry.size.trim() !== "") {
      setSizeQuantities([...sizeQuantities, { size: "", quantity: 0 }]);
    } else
      closeMessage(
        messageApi,
        "Please fill in the previous size before adding more sizes",
        "error"
      );
  };

  const removeSize = (index) => {
    const updatedsizeQuantities = [...sizeQuantities];
    updatedsizeQuantities.splice(index, 1);
    setSizeQuantities(updatedsizeQuantities);
  };

  return (
    <div>
      {sizeQuantities.map((entry, index) => (
        <div key={index}>
          <TextField
            sx={{
              width: 300,
              [`@media (max-width: 425px)`]: {
                width: "100%",
              },
            }}
            margin="dense"
            label={`Size ${index + 1}`}
            value={entry.size}
            onChange={(e) => handleSizeChange(index, e.target.value)}
          />
          <TextField
            margin="dense"
            sx={{
              width: 200,
              [`@media (max-width: 425px)`]: {
                width: "100%",
              },
            }}
            label={`Quantity of Size ${index + 1}`}
            value={entry.quantity}
            onChange={(e) => handleQuantityChange(index, e.target.value)}
          />
          {sizeQuantities.length > 1 && (
            <Button onClick={() => removeSize(index)}>Remove</Button>
          )}
        </div>
      ))}
      <Button onClick={addColor}>Add more Sizes</Button>
    </div>
  );
};

export default SizeQuantityInput;
