import dbConnect from "@/lib/mongoose";
import companyModel from "@/models/companyModel";
import privilegesModel from "@/models/privilegesModel";
// import Privileges from "@/models/privilegesModel";
// import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    // console.log(data);
    if (req.method === "POST") {
      const newPrivilege = await new privilegesModel(data.data);
      const privilege = await newPrivilege.save();
      // const privilege = await companyModel.findOneAndUpdate(
      //   {
      //     _id: data.company,
      //     "privilegesTemplate.name": { $ne: data.data.name },
      //   },
      //   { $push: { privilegesTemplate: data.data } },
      //   { new: true }
      // );
      // console.log(privilege);
      // if (!privilege)
      //   return NextResponse.json({
      //     status: 500,
      //     msg: "Template with this name already exsists.",
      //   });
      return NextResponse.json({
        status: 200,
        data: privilege,
        msg: "Template added Successfully",
      });
    }
  } catch (error) {
    if (error.code === 11000)
      return NextResponse.json({
        status: 500,
        msg: "Template with this name already exsists.",
      });
    return NextResponse.json({ status: 500, msg: error });
  }
}
