import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productId: { type: String, required: true },
  wholesalePrice: { type: Number },
  quantity: { type: Number },
  description: { type: String },
  imgUrl: { type: String },
  retailPrice: { type: Number },
  outOfStockReminder: { type: Number },
  shelves: [
    {
      _id: false,
      shelf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shelf",
        index: true,
      },
      quantity: { type: Number, default: 1 },
      color: { type: String },
      size: { type: String },
    },
  ],
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    index: true,
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  color: [{}],
  // size: [{}],
  // Add other product-related fields as needed
});
// productSchema.index({ color: 1 });
// productSchema.index({ size: 1 });
// Compound index on warehouse field for faster searching
productSchema.index({ warehouse: 1, productId: 1 }, { unique: true });

const Product =
  mongoose.models.Products || mongoose.model("Products", productSchema);

export default Product;
