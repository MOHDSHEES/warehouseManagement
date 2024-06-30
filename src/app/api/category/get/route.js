import dbConnect from "@/lib/mongoose";
import categoryModel from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      const categories = await categoryModel.find({ parent: data.id });
      if (categories.length) {
        return NextResponse.json({
          status: 200,
          data: categories,
        });
      } else
        return NextResponse.json({
          status: 201,
          data: [],
          msg: "No categories Found",
        });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
