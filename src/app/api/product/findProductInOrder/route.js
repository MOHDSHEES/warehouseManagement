import dbConnect from "@/lib/mongoose";
import orderModel from "@/models/orderModel";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
import WarehouseModel from "@/models/wareHouseModels";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// recheck if it is used or not

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    // console.log(data);
    if (req.method === "POST") {
      const orders = await orderModel
        .find({
          company: new mongoose.Types.ObjectId(data.companyId),
          orderType: "New Order",
          "order.productId": data.productId,
        })
        .sort({ createdAt: -1 })
        .limit(5);
      // console.log(orders);
      if (orders.length) {
        const filteredOrders = orders.map((order) => {
          const filteredItems = filterOrderByProductId(order, data.productId);
          // console.log(filteredItems);
          return {
            orderId: order.orderId,
            date: order.createdAt,
            item: filteredItems,
          };
        });
        // const filteredOrder = filterOrderByProductId(order, data.productId);
        return NextResponse.json({
          status: 200,
          data: filteredOrders,
        });
      }
      return NextResponse.json({ status: 500, msg: "Product Not found." });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}

const filterOrderByProductId = (order, productId) => {
  return order.order
    .filter((item) => item.productId === productId)
    .map((item) => {
      const returnItem = filterReturnItems(
        order.returns,
        item._id,
        item.orderData.shelf.color
      );
      if (returnItem) {
        item.return = returnItem;
      }
      return {
        ...item,
        payment: {
          totalPrice: order.payment.totalPrice,
          payingAmount: order.payment.payingAmount,
        },
      };
    });
};

const filterReturnItems = (returns, itemId, variant) => {
  const filteredReturns = returns.filter(
    (returnItem) => returnItem.item === itemId && returnItem.variant === variant
  );

  if (filteredReturns.length === 0) {
    return null;
  }

  // Aggregate quantities
  const totalQuantity = filteredReturns.reduce((acc, returnItem) => {
    return acc + returnItem.quantity;
  }, 0);

  // Return a single object with aggregated quantity
  return {
    item: itemId,
    quantity: totalQuantity,
    variant: variant,
    returnOrderId: filteredReturns[0].returnOrderId, // Assuming returnOrderId is the same for all
  };
};
// const filterReturnItems = (returns, itemId, variant) => {
//   return (
//     returns.find(
//       (returnItem) =>
//         returnItem.item === itemId && variant === returnItem.variant
//     ) || null
//   );
// };
