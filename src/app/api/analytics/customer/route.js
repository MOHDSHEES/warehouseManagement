import dbConnect from "@/lib/mongoose";
import CustomerAnalytics from "@/models/analyticsModels/customerAnalytics";
import ProductAnalytics from "@/models/analyticsModels/productAnalytics";
import Party from "@/models/partyModel";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
import WarehouseModel from "@/models/wareHouseModels";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// recheck if it is used or not

export async function POST(req) {
  const session = await getServerSession(req);
  // Check if the user is authenticated
  if (session && session.user && session.user.name) {
    try {
      await dbConnect();
      const data = await req.json();
      const { customerId } = data;
      // console.log(data);
      if (req.method === "POST") {
        const analytics = await CustomerAnalytics.findOne({
          customerId: customerId,
        }).populate({ path: "customerId", model: Party });
        //   const analytics = await ProductAnalytics.findOne({
        //     productId: product._id,
        //   });
        return NextResponse.json({
          status: 200,
          data: analytics,
        });
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized." });
}
