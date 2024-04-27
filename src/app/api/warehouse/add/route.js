import dbConnect from "@/lib/mongoose";
import companyModel from "@/models/companyModel";
import privilegesModel from "@/models/privilegesModel";
import userModel from "@/models/userModel";
import WarehouseModel from "@/models/wareHouseModels";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    if (req.method === "POST") {
      const warehouse = await new WarehouseModel({
        ...data.detail,
        company: data.companyId,
      });
      const newWarehouse = await warehouse.save();

      //   console.log(newWarehouse);
      // let trending = resu.map((a) => a.title);
      // console.log(resu);
      if (warehouse && warehouse._id) {
        const resu = await companyModel
          .findOneAndUpdate(
            { _id: data.companyId },
            { $push: { warehouses: newWarehouse._id } },
            { new: true, useFindAndModify: false, password: 0 }
          )
          .select({ password: 0 });
        const user = await userModel
          .findOne(
            { email: data.userEmail },
            {
              password: 0,
            }
          )
          .populate({
            path: "company",
            select: { password: 0 },
          })
          .populate("warehouse")
          .populate({ path: "privilegesTemplate", model: privilegesModel });
        //   console.log(resu);
        return NextResponse.json({ status: 200, data: user });
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
}
