import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    payment: {
      paymentMethod: { type: String },
      paymentOption: { type: String },
      paymentId: { type: String },
      payingAmount: { type: Number },
      totalPrice: { type: Number },
    },
    party: { type: mongoose.Schema.Types.ObjectId, ref: "Parties" },
    order: [],
    orderType: { type: String, index: true },
    orderId: { type: String, unique: true, index: true },
    placedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  const randomLetters = Array.from({ length: 2 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");

  // Generate random two digits
  const randomNumbers = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  const randomNumbers2 = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");

  // Get current date, month, and year
  const today = new Date();
  const date = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so add 1
  const year = (today.getFullYear() % 100).toString();

  // Combine all components to form orderId
  this.orderId =
    randomLetters + randomNumbers + date + month + year + randomNumbers2;

  next(); // Call next to proceed with saving
});
// productsSchema.index({ name: "text", category: "text" });
const orderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
// module.exports =  orderModel;
export default orderModel;
