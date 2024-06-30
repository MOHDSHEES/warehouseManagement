"use client";
import { useContext, useEffect, useState } from "react";
import { Container, Stack, Typography } from "@mui/material";
import axios from "axios";
import { closeMessage, openMessage } from "@/src/components/functions/message";
import { MyContext } from "@/src/components/context";
// import ColorQuantityInput from "@/src/components/product/colorAdd";
// import SizeQuantityInput from "@/src/components/product/sizeAdd";
import UserAccessLayout from "@/src/components/layout/userAccessLayout";
import AddProductForm from "@/src/components/product/addProductForm";
import AddCategory from "@/src/components/categories/add";

export default function ProductAdd({ params }) {
  // const { messageApi } = useContext(MyContext);
  const [disable, setdisable] = useState(false);
  const { user, setProductIds, productIds, messageApi } = useContext(MyContext);
  const [openCategories, setOpenCategories] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const categoryOptions = {
    category: null,
    subCategory: null,
    subcategory2: null,
    subcategory3: null,
    subcategory4: null,
  };
  const [categories, setCategories] = useState(categoryOptions);
  const [colorQuantities, setColorQuantities] = useState([
    { color: "", quantity: 0, size: "" },
  ]);
  // const [sizeQuantities, setSizeQuantities] = useState([
  //   { size: "", quantity: 0 },
  // ]);
  // const [color, setColor] = useState("");
  // const [size, setSize] = useState("");
  const [state, setstate] = useState({
    wholesalePrice: "",
    retailPrice: "",
    outOfStockReminder: 0,
  });
  const Inputchange = (event) => {
    const { name, value } = event.target;
    if (name === "outOfStockReminder") {
      setstate({
        ...state,
        [name]: value === "" ? "" : parseInt(value.trim()),
      });
    } else
      setstate({
        ...state,
        [name]: value.trim(),
      });
  };
  function clear() {
    setstate({
      wholesalePrice: "",
      retailPrice: "",
      outOfStockReminder: 0,
    });
    setQuantity("");
    setProductId("");
    setProductName("");
    setDescription("");
    // setColor("");
    setColorQuantities([{ color: "", quantity: 0, size: "" }]);
    // setSizeQuantities([{ size: "", quantity: 0 }]);
  }

  const handleClose = () => {
    clear();
  };

  async function submitHandler(e) {
    e.preventDefault();
    setdisable(true);
    // checking if color is provided else retrning empty array
    const validColorQuantities = colorQuantities.filter(
      (entry) => entry.color && entry.color.trim() !== ""
    );
    // const validSizeQuantities = sizeQuantities.filter(
    //   (entry) => entry.size && entry.size.trim() !== ""
    // );
    openMessage(messageApi, "Adding product...");
    if (user && user._id) {
      const { data } = await axios.post("/api/product/add", {
        detail: {
          ...state,
          productId: productId,
          productName: productName.trim(),
          quantity: parseInt(quantity),
          description: description,
          color: validColorQuantities,
          // size: validSizeQuantities,
          warehouse: params.id,
          company: user.company._id,
        },
      });
      if (data && data.status === 200) {
        const dataToPush = [
          {
            _id: data.data._id,
            productName: data.data.productName,
            productId: data.data.productId,
          },
        ];
        const updatedData = productIds.map((entry) =>
          entry.warehouseId === params.id
            ? { ...entry, productIds: [...entry.productIds, ...dataToPush] }
            : entry
        );
        setProductIds(updatedData);
        closeMessage(messageApi, "Product Sucessfully added", "success");
        clear();
        handleClose();
      } else if (data.status === 500)
        closeMessage(messageApi, data.msg, "error");
    } else signOut();
    setdisable(false);
  }

  async function getCategories(id) {
    const { data } = await axios.post("/api/category/get", {
      id: id,
    });
    if (data.status === 200)
      setCategories({ ...categoryOptions, category: data.data });
    else if (data.status === 201)
      setCategories({ ...categoryOptions, category: data.data });
  }

  useEffect(() => {
    if (!categories.category) getCategories(null);
  }, [categories]);

  return (
    <UserAccessLayout>
      <Container requiredprivilege="Register_Product" maxWidth="xl">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">Add Product</Typography>
            {/* <button
              onClick={() => setOpenCategories(true)}
              className="btn btn-primary"
            >
              Add Category
            </button> */}
          </div>
          <AddProductForm
            productName={productName}
            setProductName={setProductName}
            description={description}
            setDescription={setDescription}
            productId={productId}
            setProductId={setProductId}
            quantity={quantity}
            setQuantity={setQuantity}
            state={state}
            Inputchange={Inputchange}
            colorQuantities={colorQuantities}
            setColorQuantities={setColorQuantities}
            // sizeQuantities={sizeQuantities}
            // setSizeQuantities={setSizeQuantities}
            submitHandler={submitHandler}
            disable={disable}
          />
        </Stack>
      </Container>
      <AddCategory
        open={openCategories}
        categories={categories}
        setCategories={setCategories}
        categoryOptions={categoryOptions}
        // getCategories={getCategories}
        setOpen={setOpenCategories}
        requiredprivilege="Register_Product"
      />
    </UserAccessLayout>
  );
}
