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
        const privilege = await privilegesModel.find({
          company: data.company,
        });
        // const privilege = await companyModel.findOne(
        //   {
        //     _id: data.company,
        //   },
        //   { privilegesTemplate: 1, _id: 0 }
        // );
        //   console.log(privilege);
        if (privilege && privilege.length > 0)
          return NextResponse.json({
            status: 200,
            data: privilege,
          });

        return NextResponse.json({
          status: 202,
          msg: "No template Found.",
          data: [],
        });
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
