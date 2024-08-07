import dbConnect from "@/lib/mongoose";
import categoryModel from "@/models/categoryModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(req);
  // Check if the user is authenticated
  if (session && session.user && session.user.name) {
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
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
