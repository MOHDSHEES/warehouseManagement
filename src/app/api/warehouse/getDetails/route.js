import dbConnect from "@/lib/mongoose";
import WarehouseModel from "@/models/wareHouseModels";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    // console.log(data);
    // console.log(data);
    if (req.method === "POST") {
      const resu = await WarehouseModel.find({ _id: { $in: data.ids } });

      // console.log(resu);
      if (resu.length) return NextResponse.json({ status: 200, data: resu });
      else return NextResponse.json({ status: 200, data: null });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
