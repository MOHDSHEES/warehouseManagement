// Import necessary modules
import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const da = await req.json();

  const { to, from, warehouse, qty } = da;
  try {
    // Find the product with the given warehouse and productId
    const product = await Product.findOne({
      warehouse: warehouse,
      productId: from.productId,
    });

    if (!product) {
      return NextResponse.json({ status: 404, msg: "Product not found" });
    }
    // console.log(from);
    // Find the source shelf
    const sourceShelfIndex = product.shelves.findIndex(
      (shelf) =>
        shelf.shelf.toString() === from.shelfId && shelf.color === from.color
    );

    if (sourceShelfIndex === -1) {
      return NextResponse.json({ status: 404, msg: "Source shelf not found" });
    }

    // const quantityToTransfer = product.shelves[sourceShelfIndex].quantity;

    // Remove the source shelf
    product.shelves.splice(sourceShelfIndex, 1);

    // Find or create the destination shelf
    const destShelfIndex = product.shelves.findIndex(
      (shelf) => shelf.shelf.toString() === to && shelf.color === from.color
    );

    if (destShelfIndex === -1) {
      // Create a new shelf if not found
      product.shelves.push({
        shelf: to,
        quantity: parseInt(qty),
        color: from.color,
      });
    } else {
      // Update the existing shelf quantity
      product.shelves[destShelfIndex].quantity += parseInt(qty);
    }

    // Save the updated product
    await product.save();

    return NextResponse.json({ status: 200, data: product });
  } catch (error) {
    console.error("Error during the transfer:", error);
    return NextResponse.json({ status: 500, msg: "Internal server error" });
  }
}
