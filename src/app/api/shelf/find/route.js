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
      const regex = new RegExp(data.data, "i");
      const onlyRoot = data.onlyRoot ? data.onlyRoot : false;
      if (req.method === "POST") {
        // Create the query object
        let query = {
          warehouse: data.warehouse,
          shelfName: { $regex: regex },
        };

        // Add condition for onlyRoot if it's true
        if (onlyRoot) {
          query.childrenShelves = { $exists: true, $size: 0 };
        }

        const resu = await Shelf.find(query);
        return NextResponse.json({ status: 200, data: resu });
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
