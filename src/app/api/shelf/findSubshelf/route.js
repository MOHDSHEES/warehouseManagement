import dbConnect from "@/lib/mongoose";
import Shelf from "@/models/shelfModel";
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
        const resu = await Shelf.find({ _id: { $in: data.ids } });

        //   console.log(resu);
        if (resu.length) return NextResponse.json({ status: 200, data: resu });
        else return NextResponse.json({ status: 200, data: null });
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
