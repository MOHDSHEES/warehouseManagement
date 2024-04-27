import dbConnect from "@/lib/mongoose";
import companyModel from "@/models/companyModel";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    // console.log(data);
    if (req.method === "POST") {
      //   const resu = await userModel.findOne(
      //     { email: data.email },
      //     { password: 0 }
      //   );
      //   console.log(data.detail);
      const ifUser = await userModel.findOne({ email: data.detail.email });
      if (ifUser) {
        throw new Error("E11000 duplicate key error collection: ");
      } else {
        const company = await new companyModel(data.detail);
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
          // privileges: {
          //   Add_Employee: true,
          //   Add_Warehouse: true,
          //   Edit_Warehouse: true,
          //   Add_Shelf: true,
          //   Delete_Shelf: true,
          //   Add_Product_To_Shelf: true,
          //   Out_Of_Stock: true,
          //   Register_Product: true,
          //   Update_Product: true,
          // },
        };
        const emp = await new userModel(empData).save();
        // console.log(emp);
        // let trending = resu.map((a) => a.title);
        // console.log(resu);
        const {
          _doc: { password, ...user },
        } = newComp;

        return NextResponse.json({ user: user });
      }
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ msg: error.message });
  }
}
