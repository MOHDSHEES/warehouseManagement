import dbConnect from "@/lib/mongoose";
import Party from "@/models/partyModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      const customers = await Party.find({
        company: data.company,
        name: { $regex: data.data, $options: "i" },
      });

      return NextResponse.json({
        status: 200,
        data: customers,
      });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
