import sgMail from "@sendgrid/mail";
import getEmployeeToken from "@/src/components/token/getEmployeeToken";
import registerEmployee from "@/src/components/emailTemplates/employeeEmailTemplate";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // await dbConnect();
    const data = await req.json();
    const token = getEmployeeToken(data);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: data.state.email, // Change to your recipient
      from: { email: "official.offtheweb@gmail.com", name: "OFFTHEWEB" }, // Change to your verified sender
      subject: "Register",
      html: registerEmployee(data.state, token),
    };
    const [response] = await sgMail.send(msg);
    if (response && response.statusCode === 202)
      return NextResponse.json({
        success: true,
        message: "Registration Email has been sent to the Employee succesfully",
      });
    else
      return NextResponse.json({
        success: false,
        message: "Something went wrong. Try again later",
      });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ success: false, message: error });
  }
}
