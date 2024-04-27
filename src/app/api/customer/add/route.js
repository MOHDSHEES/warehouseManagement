import dbConnect from "@/lib/mongoose";
import Party from "@/models/partyModel";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
import userModel from "@/models/userModel";
import WarehouseModel from "@/models/wareHouseModels";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      const party = await new Party(data.data).save();
      if (party._id) {
        return NextResponse.json({
          status: 200,
          data: party,
        });
      } else
        return NextResponse.json({ status: 500, msg: "Something went Wrong." });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
