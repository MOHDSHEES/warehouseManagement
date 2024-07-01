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
      const existingProduct = await Product.findOne({
        productId: data.detail.productId,
        warehouse: data.detail.warehouse,
      });

      if (existingProduct)
        return NextResponse.json({
          status: 500,
          msg: "Product already registered with this Id.",
        });
      const newProduct = await new Product(data.detail).save();
      return NextResponse.json({ status: 200, data: newProduct });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
