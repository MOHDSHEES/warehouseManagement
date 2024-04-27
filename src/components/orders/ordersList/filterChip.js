import React from "react";
import { Chip, Stack } from "@mui/material";

const FilterChip = ({ filter, filterFunction }) => {
  const renderDateChip = () => {
    const { startDate, endDate } = filter;

    if (!startDate && endDate) {
      return (
        <Chip
          label={`Upto: ${endDate}`}
          variant="outlined"
          onDelete={() => filterFunction("endDate")}
        />
      );
    } else if (startDate && endDate) {
      return (
        <Chip
          label={`${startDate} - ${endDate}`}
          variant="outlined"
          onDelete={() => filterFunction("bothDate")}
        />
      );
    } else if (startDate && !endDate) {
      return (
        <Chip
          label={`${startDate} - Today`}
          variant="outlined"
          onDelete={() => filterFunction("startDate")}
        />
      );
    }
    return null;
  };

  const renderTotalPriceChip = () => {
    const { totalPrice, comparison } = filter;
    if (totalPrice)
      return (
        <Chip
          label={`${comparison} ${totalPrice}`}
          variant="outlined"
          onDelete={() => filterFunction("totalPrice")}
        />
      );
    return null;
  };

  const renderOtherChips = () => {
    return Object.entries(filter).map(([key, value]) => {
      if (["startDate", "endDate", "totalPrice", "comparison"].includes(key))
        return null;
      else if ((key === "name" && value && value !== "All") || value)
        return (
          <Chip
            key={key}
            label={value}
            variant="outlined"
            onDelete={() => filterFunction(key)}
          />
        );
    });
  };

  return (
    <div>
      <Stack direction="row" spacing={1}>
        {renderDateChip()}
        {renderTotalPriceChip()}
        {renderOtherChips()}
      </Stack>
    </div>
  );
};

export default FilterChip;
