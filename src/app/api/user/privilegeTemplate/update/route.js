import dbConnect from "@/lib/mongoose";
import companyModel from "@/models/companyModel";
import privilegesModel from "@/models/privilegesModel";
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
        const updatedPrivilege = await privilegesModel.findOneAndUpdate(
          { _id: data.id },
          { roles: data.state },
          { new: true }
        );
        //   const privilege = await companyModel.updateOne(
        //     {
        //       _id: data.company,
        //       "privilegesTemplate.name": data.name,
        //     },
        //     {
        //       $set: {
        //         "privilegesTemplate.$.roles": data.state, // Assuming you have a variable named `newRoles` containing the new roles object
        //       },
        //     }
        //   );
        if (updatedPrivilege && updatedPrivilege._id)
          return NextResponse.json({
            status: 200,
            data: updatedPrivilege,
          });
        else {
          return NextResponse.json({
            status: 500,
            msg: "Something went wrong. Try again later.",
          });
        }
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
