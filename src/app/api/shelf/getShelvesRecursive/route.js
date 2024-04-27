import dbConnect from "@/lib/mongoose";
import Shelf from "@/models/shelfModel";
import { NextRequest, NextResponse } from "next/server";

async function getAllParentShelves(shelfId, result = []) {
  try {
    const shelf = await Shelf.findById(shelfId);
    // console.log(shelf);
    if (shelf) {
      result.push(shelf);
      if (shelf.parentShelf) {
        await getAllParentShelves(shelf.parentShelf, result);
      }
    }
    return result;
  } catch (error) {
    // console.error("Error fetching parent shelves:", error);
    throw error;
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    if (req.method === "POST") {
      const parentShelves = await getAllParentShelves(data.id);
      //   console.log(parentShelves);

      //   console.log(parentShelves);
      if (parentShelves.length)
        return NextResponse.json({
          status: 200,
          data: parentShelves.reverse(),
        });
      else return NextResponse.json({ status: 200, data: null });
    }
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ status: 500, msg: error.message });
  }
}
