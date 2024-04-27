import { Box, Card, CardContent, CardHeader, TextField } from "@mui/material";
import React from "react";

const TopComponent = ({ name, setName, error, setError, component }) => {
  // console.log(name);
  // console.log(component);
  function inputChange(e) {
    if (component !== "update") {
      setName(e.target.value.toUpperCase());
      setError(false);
    }
  }
  //   console.log(error);
  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <CardHeader title={<small>Privileges Template</small>} />

      <CardContent sx={{ pt: 0 }} className="mt-3">
        <Box sx={{ m: -1.5 }}>
          <TextField
            sx={{ width: "100%" }}
            label="Name"
            error={error}
            variant="outlined"
            disabled={component && component === "update" ? true : false}
            required
            value={name}
            onChange={inputChange}
            helperText="Enter the Name of template. (example: ADMIN, HR)"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopComponent;
