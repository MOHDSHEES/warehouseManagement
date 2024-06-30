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
    const { totalAmountToReturn } = data;
    // console.log(data);
    if (req.method === "POST") {
      const newOrder = await new orderModel(data.data).save();
      const populatedOrder = await orderModel
        .findById(newOrder._id)
        .populate("party");
      // Update analytics for each product in the order
      await updateProductAnalytics(
        data.data.order,
        populatedOrder.orderId,
        totalAmountToReturn
      );
      await updateCustomerAnalytics(
        data.data.order,
        data.data.party,
        totalAmountToReturn
      );

      return NextResponse.json({ status: 200, data: populatedOrder });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}

// Function to update product analytics using bulk operations
async function updateProductAnalytics(orderItems, returnOrderId) {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    // console.log(currentYear);
    // console.log(currentMonth);
    // const bulkOpsUpdate = [];
    const bulkOpsInsert = [];
    const productBulkOps = [];
    const orderBulkOps = [];
    // Prepare bulk operations
    for (const itemData of orderItems) {
      const { item } = itemData;
      const quantity = parseInt(itemData.returnQty);
      //   const price = quantity * parseFloat(item.orderData.price);

      // Base update object
      const baseUpdate = {
        updateOne: {
          filter: { _id: item._id },
          update: {
            $inc: {
              quantity: +quantity,
            },
          },
        },
      };

      // Conditionally add color quantity update and arrayFilters if color is defined
      if (
        item.orderData.shelf.color !== undefined &&
        item.orderData.shelf.color !== ""
      ) {
        const colorSize = parseColorSizeString(item.orderData.shelf.color);
        baseUpdate.updateOne.update.$inc["color.$[colorElem].quantity"] =
          +quantity;

        const arrayFilters = [
          {
            "colorElem.color": colorSize.color,
          },
        ];

        if (colorSize.size !== "-") {
          arrayFilters[0]["colorElem.size"] = colorSize.size;
        }

        baseUpdate.updateOne.arrayFilters = arrayFilters;
      }
      productBulkOps.push(baseUpdate);

      //   // Conditionally add the shelves update if orderData.shelf is present
      //   if (item.orderData && item.orderData.shelf) {
      //     const shelfUpdate = {
      //       updateOne: {
      //         filter: { _id: _id },
      //         update: {
      //           $inc: {
      //             "shelves.$[elem].quantity": -quantity,
      //           },
      //         },
      //         arrayFilters: [
      //           {
      //             "elem.shelf": new mongoose.Types.ObjectId(
      //               item.orderData.shelf.shelf._id
      //             ),
      //             "elem.color": item.orderData.shelf.color,
      //           },
      //         ],
      //       },
      //     };

      //     productBulkOps.push(shelfUpdate);
      //   }

      //   pushing return items to orders
      orderBulkOps.push({
        updateOne: {
          filter: { orderId: itemData.orderId },
          update: {
            $push: {
              returns: {
                item: item._id,
                quantity: quantity,
                variant: item.orderData.shelf.color,
                returnOrderId: returnOrderId,
              },
            },
          },
        },
      });

      //   updating return qty to return in product analytics
      bulkOpsInsert.push({
        updateOne: {
          filter: { productId: item._id },
          update: {
            $inc: {
              return: quantity,
            },
          },
        },
      });
    }

    // console.log(bulkOpsUpdate);
    // Execute bulk operations
    // bulkOpsUpdate.length && (await ProductAnalytics.bulkWrite(bulkOpsUpdate));

    // Handle inserts where no sales history entry exists
    bulkOpsInsert.length && (await ProductAnalytics.bulkWrite(bulkOpsInsert));
    // console.log(JSON.stringify(orderBulkOps));
    if (orderBulkOps.length) await orderModel.bulkWrite(orderBulkOps);
    if (productBulkOps.length) await Product.bulkWrite(productBulkOps);
  } catch (err) {
    console.error("Error updating product analytics:", err);
  }
}

async function updateCustomerAnalytics(
  orderItems,
  customerId,
  totalAmountToReturn
) {
  try {
    const totalReturn = orderItems.reduce(
      (total, entry) => total + parseInt(entry.returnQty),
      0
    );
    await CustomerAnalytics.updateOne(
      { customerId: customerId },
      {
        $inc: {
          return: totalReturn,
          totalAmountToPaid: -totalAmountToReturn,
        },
      },
      { upsert: true }
    );
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
