import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import sendotp from "../emailOtp/emailTemplates/otp";
import companyModel from "@/models/companyModel";
import dbConnect from "@/lib/mongoose";

export async function POST(req, res) {
  try {
    await dbConnect();
    const data = await req.json();
    const OTP = data.otp;
    const email = data.email;
    const user = await companyModel.findOne(
      { email: data.email },
      { password: 0 }
    );
    if (user) {
      return NextResponse.json({
        status: 500,
        message: "Email Id already registered with us.",
      });
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email, // Change to your recipient
      from: { email: "official.offtheweb@gmail.com", name: "OFFTHEWEB" }, // Change to your verified sender
      subject: "OTP for Email verification ",
      html: sendotp(OTP, email),
    };
    await sgMail.send(msg);

    return NextResponse.json({
      success: true,
      message: "OTP has been sent to the Email",
    });
  } catch (error) {
    return NextResponse.json({ success: false, msg: error.message });
  }
}
