import mongoose from "mongoose";

const privilegesSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  name: { type: String, required: true },
  roles: {},
});
privilegesSchema.index({ name: 1, company: 1 }, { unique: true });
// productsSchema.index({ name: "text", category: "text" });
const privilegesModel =
  mongoose.models.Privilege || mongoose.model("Privilege", privilegesSchema);
// module.exports =  privilegesModel;
export default privilegesModel;
