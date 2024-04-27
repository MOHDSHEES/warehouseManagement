import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
import WarehouseModel from "@/models/wareHouseModels";
import { NextRequest, NextResponse } from "next/server";

async function getChildrenShelfIds(shelfId, warehouse) {
  const shelf = await Shelf.findById({ _id: shelfId, warehouse: warehouse });

  if (!shelf) {
    return []; // Shelf not found, return an empty array
  }

  let shelfIds = [shelf._id];

  const getChildrenIdsRecursive = async (shelf) => {
    const childrenIds = await Promise.all(
      shelf.childrenShelves.map(async (childShelfId) => {
        return await getChildrenIdsRecursive(
          await Shelf.findById({ _id: childShelfId, warehouse: warehouse })
        );
      })
    );

    return [shelf._id, ...childrenIds.flat()];
  };
  shelfIds = await getChildrenIdsRecursive(shelf);

  return shelfIds;
}
// async function getProductsOnShelf(shelfId, warehouse) {
//   const shelf = await Shelf.findById(shelfId).populate("childrenShelves");

//   if (!shelf) {
//     return []; // Shelf not found, return an empty array
//   }

//   // Fetch products on the current shelf
//   const productsOnShelf = await Product.find({
//     "shelves.shelf": shelfId,
//     warehouse: warehouse,
//   });

//   // Recursively get products from children shelves
//   const productsOnChildrenShelves = await Promise.all(
//     shelf.childrenShelves.map((childShelf) =>
//       getProductsOnShelf(childShelf._id, warehouse)
//     )
//   );

//   // Flatten the array of arrays into a single array
//   const allProducts = productsOnShelf.concat(...productsOnChildrenShelves);

//   return allProducts;
// }

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    // console.log(data);
    const childrenShelfIds = await getChildrenShelfIds(
      data.shelfId,
      data.warehouse
    );
    const products = await Product.find({
      "shelves.shelf": { $in: childrenShelfIds },
    }).populate({
      path: "shelves.shelf",
      model: Shelf,
      match: {
        _id: { $in: childrenShelfIds },
      },
    });

    // const products = await Product.aggregate([
    //   {
    //     $match: {
    //       "shelves.shelf": { $in: childrenShelfIds },
    //     },
    //   },
    //   {
    //     $unwind: "$shelves",
    //   },
    //   {
    //     $match: {
    //       "shelves.shelf": { $in: childrenShelfIds },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "shelf", // Assuming the name of your Shelf model's collection is "shelves"
    //       localField: "shelves.shelf",
    //       foreignField: "_id",
    //       as: "shelves.shelf",
    //     },
    //   },
    // ]);
    // await Product.populate(products, {
    //   path: "shelves.shelf",
    //   model: Shelf,
    //   match: {
    //     _id: { $in: childrenShelfIds },
    //   },
    // });
    // console.log(products);

    // console.log(products);
    if (products)
      return NextResponse.json({
        status: 200,
        data: products,
      });
    return NextResponse.json({
      status: 500,
      msg: "Details not found. Try again later.",
    });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
