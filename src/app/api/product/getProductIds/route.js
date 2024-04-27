import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
import WarehouseModel from "@/models/wareHouseModels";
import { NextRequest, NextResponse } from "next/server";

// recheck if it is used or not

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    // console.log(data);
    if (req.method === "POST") {
      const products = await Product.find(
        { warehouse: data.warehouse },
        { productName: 1, productId: 1 }
      );
      return NextResponse.json({ status: 200, data: products });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
