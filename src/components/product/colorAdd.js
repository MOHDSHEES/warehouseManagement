import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MyContext } from "../context";
import { closeMessage } from "../functions/message";
import { handleKeyDownInt } from "../functions/InputValidation";

const ColorQuantityInput = ({ colorQuantities, setColorQuantities }) => {
  const { messageApi } = useContext(MyContext);
  //   console.log(colorQuantities);
  const handleColorChange = (index, value) => {
    const updatedColorQuantities = [...colorQuantities];
    updatedColorQuantities[index].color = value;
    setColorQuantities(updatedColorQuantities);
  };

  const handleQuantityChange = (index, value) => {
    const updatedColorQuantities = [...colorQuantities];
    updatedColorQuantities[index].quantity =
      value === "" ? "" : parseInt(value, 10);
    setColorQuantities(updatedColorQuantities);
  };
  const handleSizeChange = (index, value) => {
    const updatedColorQuantities = [...colorQuantities];
    updatedColorQuantities[index].size = value;
    setColorQuantities(updatedColorQuantities);
  };

  const addColor = () => {
    // setColorQuantities([...colorQuantities, { color: "", quantity: 0 }]);
    const lastEntry = colorQuantities[colorQuantities.length - 1];
    if (lastEntry.color.trim() !== "" || lastEntry.size.trim() !== "") {
      setColorQuantities([
        ...colorQuantities,
        { color: "", quantity: 0, size: "" },
      ]);
    } else
      closeMessage(
        messageApi,
        "Please fill in the previous color or size before adding more.",
        "error"
      );
  };

  const removeColor = (index) => {
    const updatedColorQuantities = [...colorQuantities];
    updatedColorQuantities.splice(index, 1);
    setColorQuantities(updatedColorQuantities);
  };

  return (
    <div>
      {colorQuantities.map((entry, index) => (
        <div key={index}>
          <TextField
            sx={{
              width: 300,
              [`@media (max-width: 425px)`]: {
                width: "100%",
              },
            }}
            margin="dense"
            label={`Color ${index + 1}`}
            value={entry.color}
            onChange={(e) => handleColorChange(index, e.target.value)}
          />
          <TextField
            margin="dense"
            sx={{
              width: 200,
              [`@media (max-width: 425px)`]: {
                width: "100%",
              },
            }}
            label={`Quantity of color ${index + 1}`}
            value={entry.quantity}
            onChange={(e) => handleQuantityChange(index, e.target.value)}
            onKeyDown={handleKeyDownInt}
          />
          <TextField
            margin="dense"
            sx={{
              width: 200,
              [`@media (max-width: 425px)`]: {
                width: "100%",
              },
            }}
            label={`Size of color ${index + 1}`}
            value={entry.size}
            onChange={(e) => handleSizeChange(index, e.target.value)}
          />
          {colorQuantities.length > 1 && (
            <Button onClick={() => removeColor(index)}>Remove</Button>
          )}
        </div>
      ))}
      <Button onClick={addColor}>Add more Colors or Size</Button>
    </div>
  );
};

export default ColorQuantityInput;
