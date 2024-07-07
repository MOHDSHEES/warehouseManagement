import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
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
        const updatedDetails = await userModel
          .findOneAndUpdate({ _id: data.userId }, data.data, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          })
          .select("-password");
        if (updatedDetails && updatedDetails._id)
          return NextResponse.json({ status: 200, data: updatedDetails });
        else NextResponse.json({ status: 500, msg: "Something went wrong" });
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
