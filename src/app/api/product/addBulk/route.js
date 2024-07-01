import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    // console.log(data);
    if (req.method === "POST") {
      const insertedProducts = await Product.insertMany(data.products);
      return NextResponse.json({ status: 200, data: insertedProducts });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
