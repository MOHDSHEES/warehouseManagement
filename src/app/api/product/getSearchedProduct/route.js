import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
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
      // console.log(data);
      if (req.method === "POST") {
        const products = await Product.findOne({
          warehouse: data.warehouse,
          productId: data.productId,
        })
          // .populate({
          //   path: "shelves",
          //   populate: {
          //     path: "shelf",
          //     select: "shelfName",
          //     populate: {
          //       path: "rootShelf",
          //       select: "shelfName",
          //     },
          //   },
          // })

          .populate({ path: "shelves.shelf", model: Shelf })
          // .populate("shelves.shelf.parentShelf")
          // .populate({
          //   path: "company",
          //   select: "companyName address",
          // })

          .exec();
        // console.log(products);
        if (products) return NextResponse.json({ status: 200, data: products });
        else
          return NextResponse.json({
            status: 500,
            msg: "Details not found. Try again later.",
          });
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
