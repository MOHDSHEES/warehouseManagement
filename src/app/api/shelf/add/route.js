import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
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

      // console.log(data);
      if (req.method === "POST") {
        const shelf = await new Shelf(data.detail);
        const newShelf = await shelf.save();
        // console.log(newShelf);
        if (newShelf && newShelf._id) {
          // check if parent shelf exsists (i.e not a root shelf)
          if (data.detail.parentShelf) {
            // update children shelves of the parent shelf
            const resu = await Shelf.findByIdAndUpdate(
              { _id: data.detail.parentShelf },
              {
                $push: { childrenShelves: newShelf._id },
                // $push: { shelfPath: newShelf.shelfName },
              },
              { new: true, useFindAndModify: false }
            );

            // updating each products placed on the parentshelf to new root shelf
            const result = await Product.updateMany(
              { "shelves.shelf": data.detail.parentShelf },
              { $set: { "shelves.$[elem].shelf": newShelf._id } },
              { arrayFilters: [{ "elem.shelf": data.detail.parentShelf }] }
            );
            // console.log(result);
            // const da = await Product.updateMany(
            //   { "shelves.shelf": data.detail.parentShelf },
            //   { $set: { "shelves.$.shelf": newShelf._id } } // $ acts as a placeholder for the matched array element
            //   // { multi: true },
            // );
            // console.log(da);

            // console.log(resu);
            return NextResponse.json({ status: 200, data: resu });
          } else {
            // push shelf to warehouse if root shelf
            const resu = await WarehouseModel.findByIdAndUpdate(
              { _id: data.detail.warehouse },
              {
                $push: { shelves: newShelf._id },
              },
              { new: true, useFindAndModify: false }
            );
            // console.log(resu);
            return NextResponse.json({ status: 200, data: resu });
          }
        }
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}
