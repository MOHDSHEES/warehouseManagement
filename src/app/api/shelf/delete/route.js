import dbConnect from "@/lib/mongoose";
import Product from "@/models/productModel";
import Shelf from "@/models/shelfModel";
import { NextResponse } from "next/server";
import getAllChildrenShelves from "./allChildrenShelves";
import WarehouseModel from "@/models/wareHouseModels";

async function updateChildrenShelvesShelfPath(
  childrenShelvesId,
  deletedShelfName
) {
  if (childrenShelvesId && childrenShelvesId.length === 0) return;
  // Find all children shelves
  const childrenShelves = await Shelf.find({ _id: { $in: childrenShelvesId } });

  // Update shelfPath for each child
  for (const childShelf of childrenShelves) {
    // Remove the deleted shelfName from shelfPath
    childShelf.shelfPath = childShelf.shelfPath.filter(
      (name) => name !== deletedShelfName
    );

    // Save the updated childShelf
    await childShelf.save();

    // Recursively update children of this child
    await updateChildrenShelvesShelfPath(
      childShelf.childrenShelves,
      deletedShelfName
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      if (data.method === "CP") {
        const result = await cp(data);
        return NextResponse.json(result);
      } else if (data.method === "CNP") {
        const result = await cnp(data);
        return NextResponse.json(result);
      } else if (data.method === "AP") {
        const result = await ap(data);
        return NextResponse.json(result);
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}

async function cp(data) {
  const shelfData = await Shelf.findOne({ _id: data.shelf._id })
    .populate({ path: "childrenShelves", select: "shelfName" })
    .populate({
      path: "parentShelf",
      populate: { path: "childrenShelves", select: "shelfName" },
    });
  const commonShelfNames =
    shelfData &&
    shelfData.childrenShelves &&
    shelfData.childrenShelves.filter((obj1) =>
      shelfData.parentShelf.childrenShelves.some(
        (obj2) => obj2.shelfName === obj1.shelfName
      )
    );
  if (commonShelfNames && commonShelfNames.length !== 0) {
    const names = commonShelfNames.map((name) => name.shelfName);
    return {
      status: 202,
      msg: `Shelf Name Conflict. ${names}`,
      data: commonShelfNames,
    };
  } else {
    // updating products placed on that shelf
    await Product.updateMany(
      { "shelves.shelf": data.shelf._id },
      { $pull: { shelves: { shelf: data.shelf._id } } }
    );
    // deleting the shelf
    await Shelf.deleteOne({
      _id: data.shelf._id,
      warehouse: data.shelf.warehouse,
    });
    // updating the parent shelf
    const updatedShelf = await Shelf.findOne({
      _id: data.shelf.parentShelf,
    });
    // Remove the specific ID from the array
    updatedShelf &&
      updatedShelf.childrenShelves &&
      updatedShelf.childrenShelves.pull(data.shelf._id);
    if (data.shelf.childrenShelves && data.shelf.childrenShelves.length > 0) {
      // Add the new array of IDs
      updatedShelf.childrenShelves.push(...data.shelf.childrenShelves);
    }
    // Save the updated document
    const updatedData = await updatedShelf.save();

    // updating parent shelf of children shelf
    await Shelf.updateMany(
      { _id: { $in: data.shelf.childrenShelves } },
      { parentShelf: data.shelf.parentShelf }
    );
    // updating path of children shelves
    // await updateChildrenShelvesShelfPath(
    //   data.shelf.parentShelf,
    //   data.shelf.shelfName
    // );
    return {
      status: 200,
      msg: "Shelf successfully Deleted with Products.",
      data: updatedData,
    };
  }
}

async function cnp(data) {
  const shelfData = await Shelf.findOne({ _id: data.shelf._id })
    .populate({ path: "childrenShelves", select: "shelfName" })
    .populate({
      path: "parentShelf",
      populate: { path: "childrenShelves", select: "shelfName" },
    });
  const commonShelfNames = shelfData.childrenShelves.filter((obj1) =>
    shelfData.parentShelf.childrenShelves.some(
      (obj2) => obj2.shelfName === obj1.shelfName
    )
  );
  if (commonShelfNames && commonShelfNames.length !== 0) {
    const names = commonShelfNames.map((name) => name.shelfName);
    return {
      status: 202,
      msg: `Shelf Name Conflict. ${names}`,
      data: commonShelfNames,
    };
  } else {
    await Product.updateMany(
      { "shelves.shelf": data.shelf._id },
      { $set: { "shelves.$.shelf": data.shelf.parentShelf } }
    );
    await Shelf.deleteOne({
      _id: data.shelf._id,
      warehouse: data.shelf.warehouse,
    });

    const updatedShelf = await Shelf.findOne({
      _id: data.shelf.parentShelf,
    });
    // Remove the specific ID from the array
    updatedShelf.childrenShelves.pull(data.shelf._id);
    if (data.shelf.childrenShelves && data.shelf.childrenShelves.length > 0) {
      // Add the new array of IDs
      updatedShelf.childrenShelves.push(...data.shelf.childrenShelves);
    }
    // Save the updated document
    const updatedData = await updatedShelf.save();

    //   update parent shelf of children shelf
    await Shelf.updateMany(
      { _id: { $in: data.shelf.childrenShelves } },
      { parentShelf: data.shelf.parentShelf }
    );
    await updateChildrenShelvesShelfPath(
      data.shelf.parentShelf,
      data.shelf.shelfName
    );
    return {
      status: 200,
      msg: "Shelf successfully Deleted without Products.",
      data: updatedData,
    };
  }
}

async function ap(data) {
  const shel = await getAllChildrenShelves(data.shelf._id);
  const shelves = [...shel, data.shelf._id];
  // console.log(shelves);
  await Product.updateMany(
    {
      warehouse: data.shelf.warehouse,
      "shelves.shelf": { $in: shelves },
    },
    {
      $pull: {
        shelves: { shelf: { $in: shelves } },
      },
    }
  );
  let result = null;
  if (data.shelf.parentShelf) {
    result = await Shelf.findByIdAndUpdate(
      data.shelf.parentShelf,
      {
        $pull: {
          childrenShelves: data.shelf._id,
        },
      },
      { new: true }
    );
  }
  if (!data.shelf.parentShelf) {
    await WarehouseModel.findByIdAndUpdate(data.shelf.warehouse, {
      $pull: {
        shelves: data.shelf._id,
      },
    });
  }
  // console.log(result);
  await Shelf.deleteMany({ _id: { $in: shelves } });
  return {
    status: 200,
    data: result,
    msg: "Shelf and Subshelf removed sucessfully (with products)",
  };
}
