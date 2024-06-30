import dbConnect from "@/lib/mongoose";
import categoryModel from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      try {
        const category = await new categoryModel(data).save();
        return NextResponse.json({
          status: 200,
          data: category,
        });
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error
          return NextResponse.json({
            status: 500,
            msg: "Category with the same name already exists.",
          });
        }
        throw error; // rethrow the error if it's not a duplicate key error
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
