import dbConnect from "@/lib/mongoose";
import Party from "@/models/partyModel";
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
        const party = await new Party(data.data).save();
        if (party._id) {
          return NextResponse.json({
            status: 200,
            data: party,
          });
        } else
          return NextResponse.json({
            status: 500,
            msg: "Something went Wrong.",
          });
      }
    } catch (error) {
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
