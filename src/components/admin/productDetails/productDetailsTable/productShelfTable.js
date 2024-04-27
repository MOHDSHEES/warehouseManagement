import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

export default function ProductShelfTable({ searchedData }) {
  console.log(searchedData);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Shelf</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Variant</TableCell>
            {/* <TableCell>Size</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {searchedData &&
            searchedData.shelves &&
            searchedData.shelves.length > 0 &&
            searchedData.shelves.map((shelf, idx) => (
              <TableRow
                key={idx}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  {shelf.shelf.shelfPath && shelf.shelf.shelfPath.length > 0
                    ? shelf.shelf.shelfPath.map((sh, idx) => (
                        <>
                          {sh}
                          {idx < shelf.shelf.shelfPath.length - 1 && (
                            <ArrowRightIcon />
                          )}
                        </>
                      ))
                    : "Loading..."}

                  {/* {shelf.shelf.rootShelf && shelf.shelf.rootShelf && (
                    <>
                      {shelf.shelf.rootShelf.shelfName} <ArrowRightIcon />
                    </>
                  )} */}
                  {/* {shelf.shelf.shelfName} */}
                </TableCell>
                <TableCell>{shelf.quantity}</TableCell>
                <TableCell>{shelf.color}</TableCell>
                {/* <TableCell>{shelf.size ? shelf.size : "-"}</TableCell> */}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
