import Shelf from "@/models/shelfModel";

export default async function getAllChildrenShelves(shelfId, shelves = []) {
  const subshelves = await Shelf.findOne({ _id: shelfId })
    .select("childrenShelves")
    .lean();
  if (subshelves.childrenShelves && subshelves.childrenShelves.length === 0)
    return shelves;
  //   console.log(subshelves);
  shelves.push(...subshelves.childrenShelves);
  //   shelves = [...shelves, ...subshelves.childrenShelves];
  //   shelves.push(...subshelves.map((subshelf) => subshelf._id));

  for (const subshelf of subshelves.childrenShelves) {
    await getAllChildrenShelves(subshelf, shelves);
  }
  return shelves;
}
