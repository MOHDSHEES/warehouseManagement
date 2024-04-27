import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
import userModel from "@/models/userModel";
import WarehouseModel from "@/models/wareHouseModels";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    // console.log(data);
    // console.log(data);
    if (req.method === "POST") {
      const user = await new userModel(data.details).save();
      if (user._id) {
        await WarehouseModel.updateMany(
          { _id: { $in: data.details.warehouse } },
          { $push: { users: user._id } }
        );
        return NextResponse.json({
          status: 200,
          msg: "Registration successful.",
        });
      } else
        return NextResponse.json({ status: 500, msg: "Something went Wrong." });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
