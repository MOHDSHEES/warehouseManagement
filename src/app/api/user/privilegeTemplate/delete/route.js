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
      const deleted = await privilegesModel.deleteOne({
        _id: data.template,
      });
      //   console.log(deleted);
      if (deleted && deleted.acknowledged && deleted.deletedCount)
        return NextResponse.json({
          status: 200,
          msg: "Template deleted successfully.",
        });

      return NextResponse.json({
        status: 500,
        msg: "something Went wrong. Try again later.",
      });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error });
  }
}
