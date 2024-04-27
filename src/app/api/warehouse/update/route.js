import dbConnect from "@/lib/mongoose";
import companyModel from "@/models/companyModel";
import userModel from "@/models/userModel";
import WarehouseModel from "@/models/wareHouseModels";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      const updatedWarehouse = await WarehouseModel.findOneAndUpdate(
        { _id: data.warehouseId, company: data.companyId },
        data.detail,
        { new: true }
      );
      if (updatedWarehouse && updatedWarehouse._id) {
        return NextResponse.json({ status: 200, data: updatedWarehouse });
      } else {
        return NextResponse.json({
          status: 500,
          msg: "Something went wrong. Try again later.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
