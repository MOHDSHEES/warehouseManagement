import dbConnect from "@/lib/mongoose";
import CustomerAnalytics from "@/models/analyticsModels/customerAnalytics";
// import orderQueue, { addJobs } from "@/lib/orderQueue";
import ProductAnalytics from "@/models/analyticsModels/productAnalytics";
// import ProductAnalytics from "@/models/analyticsModels/productAnalytics";
import orderModel from "@/models/orderModel";
import Product from "@/models/productModel";
import mongoose from "mongoose";
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
      // Update analytics for each product in the order
      await updateProductAnalytics(data.data.order, data.data.orderType);
      await updateCustomerAnalytics(
        data.data.order,
        data.data.party,
        data.data.payment
      );

      return NextResponse.json({ status: 200, data: populatedOrder });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}

// Function to update product analytics using bulk operations
async function updateProductAnalytics(orderItems, orderType) {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    // console.log(currentYear);
    // console.log(currentMonth);
    const bulkOpsUpdate = [];
    const bulkOpsInsert = [];
    const productBulkOps = [];
    // Prepare bulk operations
    for (const item of orderItems) {
      const { _id } = item;
      const quantity = parseInt(item.orderData.qty);
      const price = quantity * parseFloat(item.orderData.price);

      const baseUpdate = {
        updateOne: {
          filter: { _id: _id },
          update: {
            $inc: {
              quantity: -quantity,
              "color.$[colorElem].quantity": -quantity,
            },
          },
          arrayFilters: [
            {
              $or: [
                { "colorElem.color": item.orderData.shelf.color },
                { "colorElem.size": item.orderData.shelf.size },
                {
                  $and: [
                    { "colorElem.color": item.orderData.shelf.color },
                    { "colorElem.size": item.orderData.shelf.size },
                  ],
                },
              ],
            },
          ],
        },
      };

      productBulkOps.push(baseUpdate);

      // Conditionally add the shelves update if orderData.shelf is present
      if (item.orderData && item.orderData.shelf) {
        const shelfUpdate = {
          updateOne: {
            filter: { _id: _id },
            update: {
              $inc: {
                "shelves.$[elem].quantity": -quantity,
              },
            },
            arrayFilters: [
              {
                "elem.shelf": new mongoose.Types.ObjectId(
                  item.orderData.shelf.shelf._id
                ),
                "elem.color": item.orderData.shelf.color,
              },
            ],
          },
        };

        productBulkOps.push(shelfUpdate);
      }

      // productBulkOps.push({
      //   updateOne: {
      //     filter: { _id: _id },
      //     update: {
      //       $inc: {
      //         quantity: -quantity,
      //         "shelves.$[elem].quantity": -quantity,
      //         "color.$[colorElem].quantity": -quantity,
      //       },
      //     },
      //     arrayFilters: [
      //       {
      //         "elem.shelf": new mongoose.Types.ObjectId(
      //           item.orderData.shelf.shelf._id
      //         ),
      //         "elem.color": item.orderData.shelf.color,
      //       },
      //       {
      //         $or: [
      //           { "colorElem.color": item.orderData.shelf.color },
      //           { "colorElem.size": item.orderData.shelf.size },
      //           {
      //             $and: [
      //               { "colorElem.color": item.orderData.shelf.color },
      //               { "colorElem.size": item.orderData.shelf.size },
      //             ],
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // });

      const analytics = await ProductAnalytics.findOne({
        productId: _id,
        salesHistory: {
          $elemMatch: {
            year: currentYear,
            month: currentMonth,
          },
        },
      });
      if (analytics) {
        bulkOpsUpdate.push({
          updateOne: {
            filter: {
              productId: _id,
              "salesHistory.year": currentYear,
              "salesHistory.month": currentMonth,
            },
            update: {
              $inc: {
                purchases: quantity,
                totalSales: price.toFixed(2),
                "salesHistory.$[elem].sales": price.toFixed(2),
                "salesHistory.$[elem].purchases": quantity,
              },
              $set: { lastPurchased: currentDate },
            },
            arrayFilters: [
              { "elem.year": currentYear, "elem.month": currentMonth },
            ],
          },
        });
      } else {
        bulkOpsInsert.push({
          updateOne: {
            filter: { productId: _id },
            update: {
              $inc: {
                purchases: quantity,
                totalSales: price.toFixed(2),
              },
              $set: { lastPurchased: currentDate },
              $push: {
                salesHistory: {
                  $each: [
                    {
                      year: currentYear,
                      month: currentMonth,
                      sales: price.toFixed(2),
                      purchases: quantity,
                    },
                  ], // New element added at the front
                  $position: 0, // Insert at the beginning of the array
                },
                // salesHistory: {
                //   year: currentYear,
                //   month: currentMonth,
                //   sales: price.toFixed(2),
                //   purchases: quantity,
                // },
              },
            },
            upsert: true,
          },
        });
      }
    }

    // console.log(bulkOpsUpdate);
    // Execute bulk operations
    bulkOpsUpdate.length && (await ProductAnalytics.bulkWrite(bulkOpsUpdate));

    // Handle inserts where no sales history entry exists
    bulkOpsInsert.length && (await ProductAnalytics.bulkWrite(bulkOpsInsert));
    if (productBulkOps.length) await Product.bulkWrite(productBulkOps);
  } catch (err) {
    console.error("Error updating product analytics:", err);
  }
}

async function updateCustomerAnalytics(orderItems, customerId, payment) {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const totalOrderValue = payment.totalPrice;
    // Calculate total order value
    // const totalOrderValue = orderItems.reduce((sum, item) => {
    //   const quantity = parseInt(item.orderData.qty);
    //   const price = parseFloat(item.orderData.price);
    //   return sum + quantity * price;
    // }, 0);
    // console.log(totalOrderValue);
    // Check if analytics for current month and year already exists
    const analytics = await CustomerAnalytics.findOneAndUpdate(
      {
        customerId: customerId,
        "purchaseHistory.year": currentYear,
        "purchaseHistory.month": currentMonth,
      },
      {
        $inc: {
          totalSpent: totalOrderValue,
          totalPurchases: 1,
          "purchaseHistory.$[elem].totalSpent": totalOrderValue,
          "purchaseHistory.$[elem].totalPurchases": 1,
        },
        $set: {
          lastPurchaseDate: currentDate,
        },
      },
      {
        new: true,
        arrayFilters: [
          { "elem.year": currentYear, "elem.month": currentMonth },
        ],
      }
    );

    // console.log(analytics);
    // If no analytics for current month and year, create one
    if (!analytics) {
      await CustomerAnalytics.updateOne(
        { customerId: customerId },
        {
          $inc: {
            totalSpent: totalOrderValue,
            totalPurchases: 1,
          },
          $set: {
            lastPurchaseDate: currentDate,
          },
          $push: {
            purchaseHistory: {
              $each: [
                {
                  year: currentYear,
                  month: currentMonth,
                  totalSpent: totalOrderValue,
                  totalPurchases: 1,
                },
              ], // New element added at the front
              $position: 0,
              // year: currentYear,
              // month: currentMonth,
              // totalSpent: totalOrderValue,
              // totalPurchases: 1,
            },
          },
        },
        { upsert: true }
      );
    }
  } catch (err) {
    console.error("Error updating customer analytics:", err);
  }
}
