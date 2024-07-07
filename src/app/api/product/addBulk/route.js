import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(req);
  // Check if the user is authenticated
  if (session && session.user && session.user.name) {
    try {
      await dbConnect();
      const requestData = await req.json();

      if (req.method === "POST") {
        const { products } = requestData;

        // Check for existing products
        const existingProducts = await Product.find({
          productId: { $in: products.map((p) => p.productId) },
        });
        const existingProductIds = existingProducts.map((p) => p.productId);

        // Filter out products that are already present
        const newProducts = products.filter(
          (product) => !existingProductIds.includes(product.productId)
        );

        await Product.insertMany(newProducts);

        // Prepare status for each product
        const statuses = products.map((product) => ({
          productId: product.productId,
          status: existingProductIds.includes(product.productId)
            ? "Skipped (Already Exists)"
            : "Added Successfully",
        }));

        return NextResponse.json({ status: 200, statuses: statuses });
      }
    } catch (error) {
      // console.error("Error inserting products:", error);
      return NextResponse.json({
        status: 500,
        statuses: [{ productId: "Error", status: error.message }],
      });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}

// import dbConnect from "@/lib/mongoose";
// import Product from "@/models/productModel";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const data = await req.json();
//     // console.log(data);
//     if (req.method === "POST") {
//       const insertedProducts = await Product.insertMany(data.products);
//       return NextResponse.json({ status: 200, data: insertedProducts });
//     }
//   } catch (error) {
//     // console.log(error);
//     return NextResponse.json({ status: 500, msg: error.message });
//   }
// }
