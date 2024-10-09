import dbConnect from "@/lib/mongoose";
import CustomerAnalytics from "@/models/analyticsModels/customerAnalytics";
// import orderQueue, { addJobs } from "@/lib/orderQueue";
import ProductAnalytics from "@/models/analyticsModels/productAnalytics";
// import ProductAnalytics from "@/models/analyticsModels/productAnalytics";
import orderModel from "@/models/orderModel";
import Party from "@/models/partyModel";
import Product from "@/models/productModel";
import mongoose from "mongoose";
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
        const newOrder = await new orderModel(data.data).save();
        const populatedOrder = await orderModel
          .findById(newOrder._id)
          .populate({ model: Party, path: "party" });
        // Update analytics for each product in the order
        await updateProductAnalytics(data.data.order);
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
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}

// Function to update product analytics using bulk operations
async function updateProductAnalytics(orderItems) {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    // console.log(currentYear);
    // console.log(currentMonth);
    const bulkOpsUpdate = [];
    const bulkOpsInsert = [];
    const productBulkOps = [];
    const mergedItems = mergeDuplicate(orderItems);
    // Prepare bulk operations
    for (const item of mergedItems) {
      const { _id } = item;
      const quantity = parseInt(item.orderData.qty);
      const price = quantity * parseFloat(item.orderData.price);
      const netPrice = item.orderData.netPrice ? item.orderData.netPrice : null;

      // Base update object
      const baseUpdate = {
        updateOne: {
          filter: { _id: _id },
          update: {
            $inc: {
              // quantity: -quantity,
            },
          },
        },
      };

      // Conditionally add color quantity update and arrayFilters if color is defined
      item.mergedOrderData.forEach((itm) => {
        // console.log(itm);
        const quantity = parseInt(itm.qty);
        // console.log(quantity);
        if (itm.shelf.color !== undefined && itm.shelf.color !== "") {
          const colorSize = parseColorSizeString(itm.shelf.color);
          // console.log(colorSize);
          baseUpdate.updateOne.update.$inc["quantity"] = -quantity;
          baseUpdate.updateOne.update.$inc["color.$[colorElem].quantity"] =
            -quantity;

          const arrayFilters = [
            {
              "colorElem.color": colorSize.color,
            },
          ];

          if (colorSize.size !== "-") {
            arrayFilters[0]["colorElem.size"] = colorSize.size;
          }
          // console.log(JSON.stringify(arrayFilters));
          baseUpdate.updateOne.arrayFilters = arrayFilters;
        }
        // console.log(JSON.stringify(baseUpdate));
        productBulkOps.push(JSON.parse(JSON.stringify(baseUpdate)));
        // Conditionally add the shelves update if orderData.shelf is present
        if (itm && itm.shelf) {
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
                    itm.shelf.shelf._id
                  ),
                  "elem.color": itm.shelf.color,
                },
              ],
            },
          };

          productBulkOps.push(shelfUpdate);
        }
      });
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
                totalSales: netPrice ? netPrice.toFixed(2) : price.toFixed(2),
              },
              $set: { lastPurchased: currentDate },
              $push: {
                salesHistory: {
                  $each: [
                    {
                      year: currentYear,
                      month: currentMonth,
                      sales: netPrice ? netPrice.toFixed(2) : price.toFixed(2),
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

    // console.log(productBulkOps);
    // Execute bulk operations
    bulkOpsUpdate.length && (await ProductAnalytics.bulkWrite(bulkOpsUpdate));

    // Handle inserts where no sales history entry exists
    // console.log(JSON.stringify(productBulkOps));
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
    // if (payment.payingAmount) {
    // }

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
          totalAmountToPaid: payment.payingAmount
            ? parseFloat(payment.totalPrice) -
              parseFloat(payment.payingAmount).toFixed(2)
            : parseFloat(payment.totalPrice),
          // totalAmountToPaid: payment.payingAmount
          //   ? parseFloat(payment.payingAmount).toFixed(2)
          //   : 0,
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
            totalAmountToPaid: payment.payingAmount
              ? parseFloat(payment.totalPrice) -
                parseFloat(payment.payingAmount).toFixed(2)
              : parseFloat(payment.totalPrice),
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

function parseColorSizeString(input) {
  // console.log(input);
  // Regular expression to match the color and size, allowing for a hyphen as a valid size
  const colorSizeRegex = /color:\s*([\w\s-]+),\s*Size:\s*([\w-]+)/;

  // Execute the regular expression on the input string
  const match = input.match(colorSizeRegex);

  if (match) {
    // Return an object with the color and size
    return {
      color: match[1].trim(),
      size: match[2].trim(),
    };
  } else {
    // Return null if the input string does not match the expected format
    return null;
  }
}

function mergeDuplicate(data) {
  const mergedItems = {};
  const array = data;

  // Iterate over the array of items
  array.forEach((item) => {
    const ite = item;
    // Generate a unique key for each item based on productId, productName, discount, and price
    const key = `${ite.productId}-${ite.productName}`;
    // Convert orderData.qty to an integer
    const quantity = parseInt(ite.orderData.qty, 10);
    // Check if the key already exists in the mergedItems
    if (mergedItems[key]) {
      if (!mergedItems[key].mergedOrderData) {
        mergedItems[key].mergedOrderData = [];
      }
      // Push the original item.orderData to mergedOrderData without modifications
      mergedItems[key].mergedOrderData.push(
        JSON.parse(JSON.stringify(item.orderData))
      );
      // If the key exists, add the quantity of the existing item
      mergedItems[key].orderData.qty += quantity;
      mergedItems[key].orderData.netPrice += parseFloat(
        quantity * ite.orderData.price
      );
      // Initialize mergedOrderData as an array if it doesn't exist
    } else {
      // If the key doesn't exist, add the item to the mergedOrderData
      mergedItems[key] = { ...item };
      mergedItems[key].mergedOrderData = [
        JSON.parse(JSON.stringify(item.orderData)),
      ];
      // Set orderData.qty to the integer value
      // mergedItems[key].orderData.qty = quantity;
      mergedItems[key].orderData.netPrice = parseFloat(
        quantity * ite.orderData.price
      );
    }
  });

  // Convert the mergedOrderData object back to an array of items
  const mergedOrderDataArray = Object.values(mergedItems);
  return mergedOrderDataArray;
}

// if (
//   item.orderData.shelf.color !== undefined &&
//   item.orderData.shelf.color !== ""
// ) {
//   const colorSize = parseColorSizeString(item.orderData.shelf.color);
//   baseUpdate.updateOne.update.$inc["color.$[colorElem].quantity"] =
//     -quantity;

//   const arrayFilters = [
//     {
//       "colorElem.color": colorSize.color,
//     },
//   ];

//   if (colorSize.size !== "-") {
//     arrayFilters[0]["colorElem.size"] = colorSize.size;
//   }

//   baseUpdate.updateOne.arrayFilters = arrayFilters;
// }

// productBulkOps.push(baseUpdate);

// // Conditionally add the shelves update if orderData.shelf is present
// if (item.orderData && item.orderData.shelf) {
//   const shelfUpdate = {
//     updateOne: {
//       filter: { _id: _id },
//       update: {
//         $inc: {
//           "shelves.$[elem].quantity": -quantity,
//         },
//       },
//       arrayFilters: [
//         {
//           "elem.shelf": new mongoose.Types.ObjectId(
//             item.orderData.shelf.shelf._id
//           ),
//           "elem.color": item.orderData.shelf.color,
//         },
//       ],
//     },
//   };

//   productBulkOps.push(shelfUpdate);
// }
