import dbConnect from "@/lib/mongoose";
import companyModel from "@/models/companyModel";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      const isUsed = await userModel.findOne(
        {
          privilegesTemplate: data.template,
        },
        { name: 1 }
      );
      //   console.log(isUsed);
      if (isUsed && isUsed._id)
        return NextResponse.json({
          status: 200,
          data: isUsed,
        });

      return NextResponse.json({
        status: 200,
        data: null,
      });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error });
  }
}
