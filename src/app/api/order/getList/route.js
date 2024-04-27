import dbConnect from "@/lib/mongoose";
import orderModel from "@/models/orderModel";
import Party from "@/models/partyModel";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

const comparisonOperators = {
  lessThan: "$lt",
  greaterThan: "$gt",
  equalTo: "$eq",
};
function constructQuery(filter, parties) {
  const query = {
    ...(parties && parties.length > 0 && { party: { $in: parties } }),
    ...(filter.orderType &&
      filter.orderType !== "All" && { orderType: filter.orderType }),
    ...(filter.startDate &&
      filter.endDate && {
        createdAt: {
          $gte: new Date(filter.startDate),
          $lte: new Date(filter.endDate + "T23:59:59.999Z"),
        },
      }),
    ...(filter.startDate &&
      !filter.endDate && { createdAt: { $gte: new Date(filter.startDate) } }),
    ...(!filter.startDate &&
      filter.endDate && {
        createdAt: { $lte: new Date(filter.endDate + "T23:59:59.999Z") },
      }),
    ...(filter.totalPrice &&
      filter.comparison &&
      comparisonOperators[filter.comparison] && {
        "payment.totalPrice": {
          [comparisonOperators[filter.comparison]]: filter.totalPrice,
        },
      }),
  };

  return query;
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const params = req.nextUrl.searchParams;
    const page = params.get("page");
    const perPage = params.get("perPage");
    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 10;
    let parties = "";
    if (data.filter && data.filter.party) {
      const regex = new RegExp(data.filter.party, "i");
      parties = await Party.find({ name: { $regex: regex } }).select("_id");
    }
    const filter = constructQuery(data.filter, parties);
    if (req.method === "POST") {
      const query = { company: data.company, ...filter };
      const orders = await orderModel
        // .find({ company: data.company })
        .find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .populate({
          path: "party",
          model: Party,
        })
        .populate({
          path: "placedBy",
          select: { name: 1 },
          model: userModel,
        });
      //   console.log(orders);
      return NextResponse.json({
        status: 200,
        data: orders,
      });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
