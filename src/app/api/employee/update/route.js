import privilegesModel from "@/models/privilegesModel";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // await dbConnect();
    const data = await req.json();
    // console.log(data);
    const user = await userModel
      .findOneAndUpdate({ _id: data._id }, data.details, {
        new: true, // Return the updated document
        projection: { password: 0 }, // Exclude password field from the returned document
      })
      .populate({
        path: "warehouse",
        select: { warehouseName: 1 },
      })
      .populate({
        path: "privilegesTemplate",
        model: privilegesModel,
      });
    // console.log(user);
    if (user && user._id)
      return NextResponse.json({
        status: 200,
        message: "Details Updated Successfully.",
        data: user,
      });
    else
      return NextResponse.json({
        status: 500,
        message: "Something went wrong. Try again later",
      });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, message: error });
  }
}
