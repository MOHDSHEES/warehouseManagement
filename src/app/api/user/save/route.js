import dbConnect from "@/lib/mongoose";
import companyModel from "@/models/companyModel";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      const ifUser = await userModel.findOne({ email: data.detail.email });
      if (ifUser) {
        throw new Error("E11000 duplicate key error collection: ");
      } else {
        const details = data.detail;
        const detailObject = details.toObject();

        // Exclude the password field from the user object
        delete detailObject.password;
        const company = await new companyModel(detailObject);
        const newComp = await company.save();
        const da = data.detail;
        const empData = {
          name: da.companyName,
          company: company._id,
          _id: company._id,
          email: da.email,
          password: da.password,
          jobType: "Permanent Employee",
          post: "Owner",
          address: da.address,
          status: 1,
        };
        await new userModel(empData).save();
        const {
          _doc: { password, ...user },
        } = newComp;

        return NextResponse.json({ user: user });
      }
    }
  } catch (error) {
    return NextResponse.json({ msg: error.message });
  }
}
