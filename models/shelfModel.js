import mongoose from "mongoose";

const shelfSchema = new mongoose.Schema({
  shelfName: { type: String },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
  parentShelf: { type: mongoose.Schema.Types.ObjectId, ref: "Shelf" },
  rootShelf: { type: mongoose.Schema.Types.ObjectId, ref: "Shelf" },
  childrenShelves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shelf" }],
  shelfPath: [{ type: String }],
});
shelfSchema.index(
  { warehouse: 1, shelfName: 1, parentShelf: 1 },
  { unique: true }
);

const Shelf = mongoose.models.Shelf || mongoose.model("Shelf", shelfSchema);

export default Shelf;
