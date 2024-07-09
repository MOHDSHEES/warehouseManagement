import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
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
      const regex = new RegExp(data.data, "i");
      // console.log(data);
      if (req.method === "POST") {
        const products = await Product.find({
          company: data.company,
          $or: [
            { productName: { $regex: regex } }, // Match productName partially
            { productId: { $regex: regex } }, // Match productId partially
          ],
        }).populate({ path: "shelves.shelf", model: Shelf });
        return NextResponse.json({ status: 200, data: products });
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
