import React, { useContext, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { closeMessage } from "../functions/message";
import { MyContext } from "../context";

export default function AddCategory({
  open,
  setOpen,
  categories,
  setCategories,
  categoryOptions,
  //   getCategories,
}) {
  const { messageApi } = useContext(MyContext);
  //   const [categories, setCategories] = useState([
  //     {
  //       _id: "4543543",
  //       parentId: null,
  //       name: "asd",
  //       subCategories: [
  //         {
  //           _id: "454534",
  //           parentId: "4543543",
  //           name: "qq",
  //           subCategories: [
  //             { _id: "32", parentId: "4543543", name: "q", subCategories: [""] },
  //           ],
  //         },
  //         { _id: "78655", parentId: "4543543", name: "qb", subategories: [""] },
  //       ],
  //     },
  //     { _id: "4543783", parentId: null, name: "hfg", subCategories: [""] },
  //     { _id: "454354397", parentId: null, name: "fbr", subCategories: [""] },
  //     { _id: "45430043", parentId: null, name: "wet", subCategories: [""] },
  //   ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [category, setCategory] = useState("");
  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  const handleClose = () => {
    setOpen(false);
    setCategories([{ name: "" }]);
  };

  async function getCategories(id, level) {
    const { data } = await axios.post("/api/category/get", {
      id: id,
    });
    if (data.status === 200)
      //   setCategories({ ...categoryOptions, [level]: data.data });
      setCategories((prevCategories) => ({
        ...prevCategories,
        [level]: data.data,
      }));

    // if (data.status === 200) setCategories(data.data);
    // else if (data.status === 201) setCategories(data.data);
  }

  function getSubCategories(category, level) {
    getCategories(category._id, level);
    setSelectedCategory(category);
  }
  //   const handleAddCategory = () => {
  //     setCategories([...categories, { name: "" }]);
  //   };
  //   const handleAddSubCategory = (category) => {
  //     if (category && category.name) {
  //       setSelectedCategory(category);
  //     }
  //   };

  //   const addCategory = () => {
  //     if (category !== "") {
  //       const newCategories = [
  //         ...categories,
  //         { name: category, subCategories: [""] },
  //       ];
  //       setCategories(newCategories);
  //     }
  //     setCategory("");

  //     // newCategories.name = event.target.value;
  //   };

  async function handleAddCategory(e, name, parent = null) {
    e.preventDefault();
    const { data } = await axios.post("/api/category/add", {
      name: name,
      parent: parent,
    });
    // console.log(data);
    if (data.status === 200) {
      closeMessage(messageApi, "Added Successfully", "success");
    } else closeMessage(messageApi, data.msg, "error");
  }
  //   const handleRemoveCategory = (index) => () => {
  //     const newCategories = [...categories];
  //     newCategories.splice(index, 1);
  //     setCategories(newCategories);
  //   };
  //   console.log(categories);
  //   const handleSubmit = async () => {
  //     try {
  //       const response = await axios.post("/api/categories", categories);
  //       console.log(response.data); // Handle success
  //     } catch (error) {
  //       console.error("Error:", error); // Handle error
  //     }
  //     handleClose();
  //   };
  //   console.log(categories);
  return (
    <Dialog fullWidth={true} maxWidth="lg" open={open} onClose={handleClose}>
      <DialogTitle>Add Categories</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                {/* <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                > */}
                {/* <Button onClick={handleAddCategory} color="primary">
                    Add Category
                  </Button> */}
                <Box
                  component="form"
                  onSubmit={(e) => handleAddCategory(e, category.trim(), null)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TextField
                    required
                    //   key={index}
                    margin="dense"
                    label="Add Category"
                    type="text"
                    value={category}
                    fullWidth
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  <IconButton
                    aria-label="add"
                    type="submit"
                    // onClick={(e)=>handleAddCategory(e,category,null)}
                    //   disabled={index !== categories.length - 1}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                {/* {index !== 0 && (
                          <IconButton
                            aria-label="delete"
                            onClick={handleRemoveCategory(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )} */}
                <List>
                  {categories.category &&
                    categories.category.map((category, index) => (
                      <ListItem
                        key={index}
                        disablePadding
                        onClick={() =>
                          getSubCategories(category, "subCategory")
                        }
                      >
                        <ListItemButton>
                          <ListItemText primary={category.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
                {/* </Box> */}
              </CardContent>
            </Card>
          </Grid>
          {categories.subCategory && (
            <SubCategories
              selectedCategory={selectedCategory}
              handleAddCategory={handleAddCategory}
              subCategories={categories.subCategory}
            />
          )}

          {/* {selectedCategory && selectedCategory.name && (
            <SubCategories
              selectedCategory={selectedCategory}
              handleAddCategory={handleAddCategory}
            />
          )} */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>

        <Button
          // onClick={handleSubmit}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SubCategories({ selectedCategory, handleAddCategory, subCategories }) {
  //   console.log(selectedCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [SubCategory, setSubCategory] = useState("");
  //   console.log(selectedSubCategory);
  return (
    <>
      <Grid item xs={3}>
        <Card>
          <CardContent>
            <Box
              component="form"
              onSubmit={(e) =>
                handleAddCategory(e, SubCategory.trim(), selectedCategory._id)
              }
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextField
                required
                margin="dense"
                label="Add SubCategory"
                value={SubCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                type="text"
                fullWidth
              />
              <IconButton type="submit" aria-label="add">
                <AddIcon />
              </IconButton>
            </Box>
            <List>
              {subCategories.length > 0 &&
                subCategories.map((category, index) => (
                  <ListItem
                    key={index}
                    disablePadding
                    onClick={() => setSelectedSubCategory(category)}
                  >
                    <ListItemButton>
                      <ListItemText primary={category.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
            {/* </Box> */}
          </CardContent>
        </Card>
      </Grid>
      {selectedSubCategory && selectedSubCategory.name && (
        <SubCategories selectedCategory={selectedSubCategory} />
      )}
    </>
  );
}
