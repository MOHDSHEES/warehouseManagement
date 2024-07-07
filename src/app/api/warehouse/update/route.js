import dbConnect from "@/lib/mongoose";
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
      if (req.method === "POST") {
        const updatedWarehouse = await WarehouseModel.findOneAndUpdate(
          { _id: data.warehouseId, company: data.companyId },
          data.detail,
          { new: true }
        );
        if (updatedWarehouse && updatedWarehouse._id) {
          return NextResponse.json({ status: 200, data: updatedWarehouse });
        } else {
          return NextResponse.json({
            status: 500,
            msg: "Something went wrong. Try again later.",
          });
        }
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
