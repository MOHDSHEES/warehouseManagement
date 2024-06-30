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
});

categorySchema.index(
  { name: 1, parent: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);
// productsSchema.index({ name: "text", category: "text" });
const categoryModel =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
// module.exports =  categoryModel;
export default categoryModel;
