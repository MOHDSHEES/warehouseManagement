import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import WarehouseModel from "@/models/wareHouseModels";
import { getServerSession } from "next-auth";
// import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(req);
  // await Product.updateMany({}, [
  //   { $set: { productId: { $toUpper: "$productId" } } },
  // ]);

  // Check if the user is authenticated
  if (session && session.user && session.user.name) {
    try {
      await dbConnect();
      const data = await req.json();
      // console.log(data);
      // console.log(data);
      if (req.method === "POST") {
        const resu = await WarehouseModel.find({ _id: { $in: data.ids } });

        // console.log(resu);
        if (resu.length) return NextResponse.json({ status: 200, data: resu });
        else return NextResponse.json({ status: 200, data: null });
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
