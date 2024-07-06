import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  name: { type: String },
  password: { type: String, required: true },
  joiningDate: { type: String },
  jobType: { type: String },
  post: { type: String },
  gender: { type: String },
  address: { type: String },
  privilegesTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Privilege",
  },
  status: { type: Number, default: 1 },
  warehouse: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },
  ],
  // privileges: {},
});

// productsSchema.index({ name: "text", category: "text" });
const userModel = mongoose.models.Users || mongoose.model("Users", userSchema);
// module.exports =  userModel;
export default userModel;
