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
    try {
      await dbConnect();
      const data = await req.json();

      // console.log(data);
      if (req.method === "POST") {
        const zeroQuantityProductCount = await Product.countDocuments({
          $or: [
            { quantity: { $lte: 0 } },
            { "color.quantity": { $lte: 0 } },
            { $expr: { $lte: ["$quantity", "$outOfStockReminder"] } },
            { $expr: { $lte: ["$color.quantity", "$outOfStockReminder"] } },
          ],
          warehouse: data.warehouse,
        });

        // const zeroQuantityProductCount = await Product.countDocuments({
        //   $or: [{ quantity: "0" }, { "color.quantity": "0" }],
        //   warehouse: data.warehouse,
        // });
        // Get details of 5 products with quantity 0
        const zeroQuantityProducts = await Product.find({
          $or: [
            {
              $or: [
                { quantity: 0 },
                { $expr: { $lte: ["$quantity", "$outOfStockReminder"] } },
              ],
            },
            {
              $or: [
                { "color.quantity": 0 }, // Check if any color quantity is 0
                {
                  $expr: {
                    $anyElementTrue: {
                      $map: {
                        input: "$color",
                        as: "c",
                        in: { $lte: ["$$c.quantity", "$outOfStockReminder"] },
                      },
                    },
                  },
                },
              ],
            },
            // {
            //   $or: [
            //     { "color.quantity": 0 },
            //     { $expr: { $lte: ["$color.quantity", "$outOfStockReminder"] } },
            //   ],
            // },
          ],
          warehouse: data.warehouse,
        }).limit(5);
        return NextResponse.json({
          status: 200,
          data: {
            count: zeroQuantityProductCount,
            products: zeroQuantityProducts,
          },
        });
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
