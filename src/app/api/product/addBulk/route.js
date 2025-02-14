import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(req);

  if (!session || !session.user || !session.user.name) {
    return NextResponse.json({ status: 401, msg: "Not Authorized" });
  }

  try {
    await dbConnect();
    const requestData = await req.json();

    if (req.method !== "POST") {
      return NextResponse.json({ status: 405, msg: "Method Not Allowed" });
    }

    const { products, warehouse } = requestData;
    const warehouseObjectId = new mongoose.Types.ObjectId(warehouse);

    // Ensure unique products by productId
    const uniqueProducts = Object.values(
      products.reduce((acc, product) => {
        acc[product.productId] = { ...product, productId: product.productId };
        return acc;
      }, {})
    );

    const productIds = uniqueProducts.map((p) => p.productId);

    // Find existing products in the given warehouse
    const existingProducts = await Product.find({
      productId: { $in: productIds },
      warehouse: warehouseObjectId,
    });

    const existingProductIds = new Set(
      existingProducts.map((p) => p.productId)
    );

    // Separate new and existing products
    const productsToUpdate = uniqueProducts.filter((p) =>
      existingProductIds.has(p.productId)
    );
    const productsToInsert = uniqueProducts.filter(
      (p) => !existingProductIds.has(p.productId)
    );

    // Bulk update existing products
    if (productsToUpdate.length > 0) {
      const bulkUpdateOps = productsToUpdate.map((product) => ({
        updateOne: {
          filter: {
            productId: product.productId,
            warehouse: warehouseObjectId,
          },
          update: { $set: product },
        },
      }));
      await Product.bulkWrite(bulkUpdateOps);
    }

    // Bulk insert new products
    if (productsToInsert.length > 0) {
      await Product.insertMany(
        productsToInsert.map((product) => ({
          ...product,
          warehouse: warehouseObjectId,
        }))
      );
    }

    // Response statuses
    const statuses = productIds.map((id) => ({
      productId: id,
      status: existingProductIds.has(id)
        ? "Updated Successfully"
        : "Added Successfully",
    }));

    return NextResponse.json({ status: 200, statuses });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      statuses: [{ productId: "Error", status: error.message }],
    });
  }
}

// import dbConnect from "@/lib/mongoose";
// import Product from "@/models/productModel";
// import mongoose from "mongoose";
// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req) {
//   const session = await getServerSession(req);
//   // Check if the user is authenticated
//   if (session && session.user && session.user.name) {
//     try {
//       await dbConnect();
//       const requestData = await req.json();
//       if (req.method === "POST") {
//         const { products, warehouse } = requestData;
//         // console.log(warehouse);

//         const uniqueProducts = [];
//         const seenProductIds = new Set();

//         for (const product of products) {
//           const productIdUpper = product.productId; // Convert to uppercase for consistency

//           if (!seenProductIds.has(productIdUpper)) {
//             seenProductIds.add(productIdUpper);
//             uniqueProducts.push({ ...product, productId: productIdUpper }); // Store with uppercase productId
//           }
//         }

//         // console.log(uniqueProducts);
//         const warehouseObjectId = new mongoose.Types.ObjectId(warehouse);
//         // Check for existing products
//         const existingProducts = await Product.find({
//           productId: {
//             $in: uniqueProducts.map((p) => p.productId),
//           },
//           warehouse: warehouseObjectId,
//         });
//         const existingProductIds = existingProducts.map((p) => p.productId);
//         // console.log(existingProductIds);
//         // Filter out products that are already present
//         const newProducts = uniqueProducts.filter(
//           (product) => !existingProductIds.includes(product.productId)
//         );

//         await Product.insertMany(newProducts);

//         // Prepare status for each product
//         const statuses = uniqueProducts.map((product) => ({
//           productId: product.productId,
//           status: existingProductIds.includes(product.productId)
//             ? "Skipped (Already Exists)"
//             : "Added Successfully",
//         }));

//         return NextResponse.json({ status: 200, statuses: statuses });
//       }
//     } catch (error) {
//       // console.error("Error inserting products:", error);
//       return NextResponse.json({
//         status: 500,
//         statuses: [{ productId: "Error", status: error.message }],
//       });
//     }
//   } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
// }

// // import dbConnect from "@/lib/mongoose";
// // import Product from "@/models/productModel";
// // import { NextRequest, NextResponse } from "next/server";

// // export async function POST(req) {
// //   try {
// //     await dbConnect();
// //     const data = await req.json();
// //     // console.log(data);
// //     if (req.method === "POST") {
// //       const insertedProducts = await Product.insertMany(data.products);
// //       return NextResponse.json({ status: 200, data: insertedProducts });
// //     }
// //   } catch (error) {
// //     // console.log(error);
// //     return NextResponse.json({ status: 500, msg: error.message });
// //   }
// // }
