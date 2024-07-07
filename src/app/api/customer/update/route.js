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
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
