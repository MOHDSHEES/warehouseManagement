// import dbConnect from "@/lib/mongoose";
// import orderModel from "@/models/orderModel";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const data = await req.json();
//     if (req.method === "POST") {
//       const newOrder = await new orderModel(data.data).save();
//       const populatedOrder = await orderModel
//         .findById(newOrder._id)
//         .populate("party");

//       return NextResponse.json({ status: 200, data: populatedOrder });
//     }
//   } catch (error) {
//   // console.log(error);
//     return NextResponse.json({ status: 500, msg: error.message });
//   }
// }

import dbConnect from "@/lib/mongoose";
import orderQueue, { addJobs } from "@/lib/orderQueue";
// import ProductAnalytics from "@/models/analyticsModels/productAnalytics";
import orderModel from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    // console.log(data);
    if (req.method === "POST") {
      const newOrder = await new orderModel(data.data).save();
      const populatedOrder = await orderModel
        .findById(newOrder._id)
        .populate("party");

      try {
        addJobs(data.data.order);
        // const job = await orderQueue.add({
        //   order: data.data.order,
        //   customerId: data.data.customerId,
        //   warehouseId: data.data.warehouseId,
        // });
        // console.log(`Job added with ID: ${job.id}`);
      } catch (addError) {
        console.error("Error adding job to queue:", addError);
      }
      // Update analytics for each product in the order
      // await updateProductAnalytics(data.data.order);

      return NextResponse.json({ status: 200, data: populatedOrder });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}

// Function to update product analytics using bulk operations
// async function updateProductAnalytics(orderItems) {
//   try {
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth() + 1;
//     console.log(currentYear);
//     console.log(currentMonth);
//     const bulkOpsUpdate = [];
//     const bulkOpsInsert = [];
//     // Prepare bulk operations
//     for (const item of orderItems) {
//       const { _id } = item;
//       const quantity = item.orderData.qty;
//       const price = parseInt(quantity) * parseFloat(item.orderData.price);

//       const analytics = await ProductAnalytics.findOne({
//         productId: _id,
//         salesHistory: {
//           $elemMatch: {
//             year: currentYear,
//             month: currentMonth,
//           },
//         },
//       });
//       if (analytics) {
//         bulkOpsUpdate.push({
//           updateOne: {
//             filter: {
//               productId: _id,
//               "salesHistory.year": currentYear,
//               "salesHistory.month": currentMonth,
//             },
//             update: {
//               $inc: {
//                 purchases: quantity,
//                 totalSales: price.toFixed(2),
//                 "salesHistory.$[elem].sales": price.toFixed(2),
//                 "salesHistory.$[elem].purchases": quantity,
//               },
//               $set: { lastPurchased: currentDate },
//             },
//             arrayFilters: [
//               { "elem.year": currentYear, "elem.month": currentMonth },
//             ],
//           },
//         });
//       } else {
//         bulkOpsInsert.push({
//           updateOne: {
//             filter: { productId: _id },
//             update: {
//               $inc: { purchases: quantity, totalSales: price.toFixed(2) },
//               $set: { lastPurchased: currentDate },
//               $push: {
//                 salesHistory: {
//                   year: currentYear,
//                   month: currentMonth,
//                   sales: price.toFixed(2),
//                   purchases: quantity,
//                 },
//               },
//             },
//             upsert: true,
//           },
//         });
//       }
//     }

//     console.log(bulkOpsUpdate);
//     // Execute bulk operations
//     bulkOpsUpdate.length && (await ProductAnalytics.bulkWrite(bulkOpsUpdate));

//     // Handle inserts where no sales history entry exists
//     bulkOpsInsert.length && (await ProductAnalytics.bulkWrite(bulkOpsInsert));
//   } catch (err) {
//     console.error("Error updating product analytics:", err);
//   }
// }
