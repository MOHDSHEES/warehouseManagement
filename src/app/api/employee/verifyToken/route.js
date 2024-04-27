import { NextResponse } from "next/server";
import verifyEmployeeToken from "@/src/components/token/verifyEmployeeToken";
import userModel from "@/models/userModel";

export async function POST(req) {
  try {
    // await dbConnect();
    const data = await req.json();
    const isVerified = verifyEmployeeToken(data.token);
    if (isVerified.status === 200) {
      const user = await userModel.findOne({
        email: isVerified.data.email,
        company: isVerified.data.company,
      });
      // console.log(user);
      if (user && user._id)
        return NextResponse.json({ status: 404, msg: "Access forbidden" });
      else return NextResponse.json(isVerified);
    }
    return NextResponse.json(isVerified);
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 404, msg: error });
  }
}
