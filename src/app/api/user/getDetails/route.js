import dbConnect from "@/lib/mongoose";
import companyModel from "@/models/companyModel";
import privilegesModel from "@/models/privilegesModel";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      // const admin = await companyModel
      //   .findOne({ email: data.email }, { password: 0 })
      //   .populate("warehouses");
      const resu = await userModel
        .findOne({ email: data.email }, { password: 0 })
        .populate({
          path: "company",
          select: { password: 0 },
        })
        .populate("warehouse")
        .populate({ path: "privilegesTemplate", model: privilegesModel });
      // if (admin) {
      //   return NextResponse.json({ status: 200, data: admin });
      // }
      // console.log(resu);
      if (resu) {
        return NextResponse.json({ status: 200, data: resu });
      } else {
        return NextResponse.json({ status: 500, msg: "Oops! No data found." });
      }
    } else {
      throw new Error(`Unsupported HTTP method: ${req.method}`);
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ error });
  }
}
