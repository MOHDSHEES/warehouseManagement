import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
import WarehouseModel from "@/models/wareHouseModels";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    // console.log(data);
    if (req.method === "POST") {
      const zeroQuantityProductCount = await Product.countDocuments({
        $or: [{ quantity: "0" }, { "color.quantity": "0" }],
        warehouse: data.warehouse,
      });
      // Get details of 5 products with quantity 0
      const zeroQuantityProducts = await Product.find({
        $or: [{ quantity: "0" }, { "color.quantity": "0" }],
        warehouse: data.warehouse,
      }).limit(5);
      return NextResponse.json({
        status: 200,
        data: {
          count: zeroQuantityProductCount,
          products: zeroQuantityProducts,
        },
      });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
