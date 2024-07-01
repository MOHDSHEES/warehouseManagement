import mongoose from "mongoose";

const generateUniqueShelfId = async (warehouseId) => {
  const idLength = 10;
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let shelfId;

  do {
    shelfId = Array.from(
      { length: idLength },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    const existingShelf = await Shelf.findOne({
      warehouse: warehouseId,
      shelfId,
    });
    if (!existingShelf) break;
  } while (true);

  return shelfId;
};

const shelfSchema = new mongoose.Schema({
  shelfName: { type: String },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
  parentShelf: { type: mongoose.Schema.Types.ObjectId, ref: "Shelf" },
  rootShelf: { type: mongoose.Schema.Types.ObjectId, ref: "Shelf" },
  childrenShelves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shelf" }],
  shelfPath: [{ type: String }],
  shelfId: { type: String, required: true },
});
shelfSchema.index(
  { warehouse: 1, shelfName: 1, parentShelf: 1 },
  { unique: true }
);
shelfSchema.index({ warehouse: 1, shelfId: 1 }, { unique: true });

shelfSchema.pre("validate", async function (next) {
  if (!this.shelfId) {
    this.shelfId = await generateUniqueShelfId(this.warehouse);
  }
  next();
});

const Shelf = mongoose.models.Shelf || mongoose.model("Shelf", shelfSchema);

export default Shelf;
