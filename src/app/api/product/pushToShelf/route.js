import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
import WarehouseModel from "@/models/wareHouseModels";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(req);
  // Check if the user is authenticated
  if (session && session.user && session.user.name) {
    await dbConnect();
    const data = await req.json();
    //   console.log(data.detail);
    try {
      const product = await Product.findOne({
        productId: data.productId,
        warehouse: data.warehouse,
      });
      if (!product) {
        // Handle the case where the product is not found
        return NextResponse.json({ status: 500, msg: "Product not found." });
      }

      // Check if the shelf is already present in the shelves array
      const shelfExists = product.shelves.some(
        (shelf) =>
          shelf.shelf.equals(data.detail.shelves.shelf) &&
          shelf.color === data.detail.shelves.color &&
          shelf.size === data.detail.shelves.size
      );

      if (!shelfExists) {
        // If the shelf is not present, push the new shelf details
        product.shelves.push(data.detail.shelves);
        // Save the updated product
        const updatedProduct = await product.save();
        //   console.log(updatedProduct);
        return NextResponse.json({ status: 200, data: updatedProduct });
      } else {
        return NextResponse.json({
          status: 500,
          msg: "Product already present on shelf.",
        });
      }
    } catch (error) {
      // console.error("Error pushing into shelves:", error);
      return NextResponse.json({ status: 500, msg: error });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
