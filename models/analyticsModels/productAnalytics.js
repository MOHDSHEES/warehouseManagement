import mongoose from "mongoose";

const salesHistorySchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    sales: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
  },
  { _id: false }
);

const productAnalyticsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  purchases: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  salesHistory: [salesHistorySchema],
});

const ProductAnalytics =
  mongoose.models.ProductAnalytics ||
  mongoose.model("ProductAnalytics", productAnalyticsSchema);

export default ProductAnalytics;
