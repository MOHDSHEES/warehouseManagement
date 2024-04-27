import dbConnect from "@/lib/mongoose";
import orderModel from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      const newOrder = await new orderModel(data.data).save();
      const populatedOrder = await orderModel
        .findById(newOrder._id)
        .populate("party");

      return NextResponse.json({ status: 200, data: populatedOrder });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
