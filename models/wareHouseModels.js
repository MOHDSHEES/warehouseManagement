import mongoose from "mongoose";

// mongoose.set("useCreateIndex", true);
// schema.index({ title: "text" });
const warehouseSchema = new mongoose.Schema({
  warehouseName: { type: String, required: true },
  address: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  shelves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shelf" }],
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});

// productsSchema.index({ name: "text", category: "text" });
warehouseSchema.index({ company: 1, warehouseName: 1 }, { unique: true });
const WarehouseModel =
  mongoose.models.Warehouse || mongoose.model("Warehouse", warehouseSchema);

// module.exports =  categoriesModel;
export default WarehouseModel;
