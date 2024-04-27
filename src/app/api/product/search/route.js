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
      //   const searchRegex = new RegExp(data.search, "i");
      const products = await Product.find(
        { warehouse: data.warehouse },
        { productId: 1, productName: 1 }
      );
      //   const products = await Product.find({
      //     $or: [
      //       { productId: { $regex: searchRegex } },
      //       { productName: { $regex: searchRegex } },
      //     ],
      //   });
      return NextResponse.json({ status: 200, data: products });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
