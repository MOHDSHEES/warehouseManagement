import dbConnect from "@/lib/mongoose";
import privilegesModel from "@/models/privilegesModel";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
import userModel from "@/models/userModel";
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
      const params = req.nextUrl.searchParams;

      const page = params.get("page");
      const perPage = params.get("perPage");
      const filter = params.get("filter");
      const pageNumber = parseInt(page) || 1;
      const itemsPerPage = parseInt(perPage) || 15;
      if (req.method === "POST") {
        if (!filter || filter === "all") {
          const user = await userModel
            .find({ company: data.company })
            .skip((pageNumber - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .populate({
              path: "warehouse",
              select: { warehouseName: 1 },
            })
            .populate({
              path: "privilegesTemplate",
              model: privilegesModel,
            });
          //   console.log(user);
          return NextResponse.json({
            status: 200,
            data: user,
          });
        } else {
          const user = await userModel
            .find({ company: data.company, privilegesTemplate: filter })
            .skip((pageNumber - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .populate({
              path: "warehouse",
              select: { warehouseName: 1 },
            })
            .populate({
              path: "privilegesTemplate",
              model: privilegesModel,
            });
          //   console.log(user);
          return NextResponse.json({
            status: 200,
            data: user,
          });
        }
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
