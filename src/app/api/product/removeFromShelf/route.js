import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
// import WarehouseModel from "@/models/wareHouseModels";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(req);
  // Check if the user is authenticated
  if (session && session.user && session.user.name) {
    await dbConnect();
    const da = await req.json();

    try {
      const { data, qty, isRequired, warehouse } = da;
      // console.log(data);
      // Find the product
      const product = await Product.findOne({
        productId: data.productId,
        warehouse: warehouse,
      }).populate({ path: "shelves.shelf", model: Shelf });

      if (!product) {
        return NextResponse.json({ status: 404, msg: "Product not found" });
      }

      // Find the correct shelf in the product's shelves array
      const shelfIndex = product.shelves.findIndex(
        (shelf) =>
          shelf.shelf._id.toString() === data.shelfId &&
          shelf.color === data.color
      );

      if (shelfIndex === -1) {
        return NextResponse.json({
          status: 404,
          msg: "Shelf not found or color not available on this shelf",
        });
      }
      // console.log(shelfIndex);
      // If isRequired is true, remove the entire shelf from the shelves array
      if (isRequired) {
        product.shelves.splice(shelfIndex, 1);
      } else {
        // Decrease the quantity on the specified shelf and color
        const quantityToDecrease = parseInt(qty);
        product.shelves[shelfIndex].quantity -= quantityToDecrease;
      }

      // Save the updated product
      await product.save();

      return NextResponse.json({ status: 200, data: product });
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      return NextResponse.json({ status: 500, msg: "Internal server error" });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
