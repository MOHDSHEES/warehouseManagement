import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// productsSchema.index({ name: "text", category: "text" });
const categoryModel =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
// module.exports =  categoryModel;
export default categoryModel;
