import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  // password: { type: String, required: true },
  warehouses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" }],
});

// productsSchema.index({ name: "text", category: "text" });
const companyModel =
  mongoose.models.Company || mongoose.model("Company", companySchema);
// module.exports =  companyModel;
export default companyModel;
