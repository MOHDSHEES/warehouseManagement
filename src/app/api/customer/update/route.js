import dbConnect from "@/lib/mongoose";
import Party from "@/models/partyModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    // console.log(data);
    if (req.method === "POST") {
      const updatedDetails = await Party.findOneAndUpdate(
        { _id: data.customerId, company: data.company },
        data.data,
        { new: true }
      );
      return NextResponse.json({ status: 200, data: updatedDetails });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
