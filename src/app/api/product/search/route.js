import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
// import Shelf from "@/models/shelfModel";
// import WarehouseModel from "@/models/wareHouseModels";
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
        //   const searchRegex = new RegExp(data.search, "i");
        const products = await Product.find(
          { warehouse: data.warehouse },
          { productId: 1, productName: 1 }
        );
        //   const products = await Product.find({
        //     $or: [
        //       { productId: { $regex: searchRegex } },
        //       { productName: { $regex: searchRegex } },
        //     ],
        //   });
        return NextResponse.json({ status: 200, data: products });
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
