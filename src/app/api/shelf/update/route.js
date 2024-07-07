import dbConnect from "@/lib/mongoose";
import Shelf from "@/models/shelfModel";
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
        //   const shelf = await new Shelf(data.detail);
        //   const newShelf = await shelf.save();
        const newShelf = await Shelf.findOneAndUpdate(
          { _id: data.shelfData._id, warehouse: data.shelfData.warehouse },
          data.detail,
          { new: true }
        );

        // Recursively update children shelves
        await updatePathOfChildrenShelves(
          newShelf._id,
          newShelf.shelfPath.length,
          newShelf.shelfName
        );
        if (newShelf && newShelf._id) {
          return NextResponse.json({ status: 200, data: newShelf });
        }
      }
    } catch (error) {
      // console.log(error);
      return NextResponse.json({ status: 500, msg: error.message });
    }
  } else return NextResponse.json({ status: 501, msg: "Not Authorized" });
}

async function updatePathOfChildrenShelves(shelfId, pathLength, name) {
  const subshelves = await Shelf.findOne({ _id: shelfId })
    .select("childrenShelves")
    .lean();
  //   console.log(subshelves);
  if (subshelves.childrenShelves && subshelves.childrenShelves.length === 0)
    return;

  for (const subshelf of subshelves.childrenShelves) {
    // subshelf.shelfPath[pathLength - 1] = name; // Update shelfPath at the specified index
    await Shelf.findByIdAndUpdate(
      subshelf._id,
      { $set: { [`shelfPath.${pathLength - 1}`]: name } },
      { new: true }
    );
    await updatePathOfChildrenShelves(subshelf, pathLength, name);
  }
  return;
}
