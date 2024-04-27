import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    customerType: {
      // e.g., Individual, Company, etc.
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNo: {
      type: String,
    },
    address: {
      type: String,
    },
    totalAmount: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  }
  // { timestamps: true }
);

const Party = mongoose.models.Parties || mongoose.model("Parties", partySchema);

export default Party;
