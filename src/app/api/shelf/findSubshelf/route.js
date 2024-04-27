import dbConnect from "@/lib/mongoose";
import Shelf from "@/models/shelfModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      const resu = await Shelf.find({ _id: { $in: data.ids } });

      //   console.log(resu);
      if (resu.length) return NextResponse.json({ status: 200, data: resu });
      else return NextResponse.json({ status: 200, data: null });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
