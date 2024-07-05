import dbConnect from "@/lib/mongoose";
import companyModel from "@/models/companyModel";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
import WarehouseModel from "@/models/wareHouseModels";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      const resu = await Shelf.findOne({
        warehouse: data.warehouse,
        shelfId: data.shelfId,
      });
      if (resu) return NextResponse.json({ status: 200, data: resu });
      return NextResponse.json({ status: 500, msg: "Shelf Not found." });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
