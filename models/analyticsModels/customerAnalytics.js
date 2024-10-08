import mongoose from "mongoose";

const purchaseHistorySchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    totalSpent: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
  },
  { _id: false }
);

const customerAnalyticsSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parties",
    required: true,
  },
  totalSpent: { type: Number, default: 0 },
  totalAmountToPaid: { type: Number },
  totalPurchases: { type: Number, default: 0 },
  //   averageOrderValue: { type: Number, default: 0 },
  purchaseHistory: [purchaseHistorySchema],
  return: { type: Number, default: 0 },
  lastPurchaseDate: { type: Date },
});

const CustomerAnalytics =
  mongoose.models.CustomerAnalytics ||
  mongoose.model("CustomerAnalytics", customerAnalyticsSchema);

export default CustomerAnalytics;
