import dbConnect from "@/lib/mongoose";
import orderModel from "@/models/orderModel";
import Party from "@/models/partyModel";
import userModel from "@/models/userModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(req);
  // Check if the user is authenticated
  if (session && session.user && session.user.name) {
    try {
      await dbConnect();
      const data = await req.json();
      if (req.method === "POST") {
        const order = await orderModel
          .findOne({ company: data.company, orderId: data.orderId })
          .populate({
            path: "party",
            model: Party,
          })
          .populate({
            path: "placedBy",
            select: { name: 1 },
            model: userModel,
          });
        if (order && order._id)
          return NextResponse.json({
            status: 200,
            data: order,
          });
        return NextResponse.json({
          status: 400,
          msg: "No orders found for the searched order ID.",
        });
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
