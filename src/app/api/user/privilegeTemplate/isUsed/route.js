import dbConnect from "@/lib/mongoose";
import userModel from "@/models/userModel";
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
        const isUsed = await userModel.findOne(
          {
            privilegesTemplate: data.template,
          },
          { name: 1 }
        );
        //   console.log(isUsed);
        if (isUsed && isUsed._id)
          return NextResponse.json({
            status: 200,
            data: isUsed,
          });

        return NextResponse.json({
          status: 200,
          data: null,
        });
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
