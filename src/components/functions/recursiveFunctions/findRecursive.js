export default function findParentShelfRecursively(nodeId, shelves) {
  for (const shelf of shelves) {
    if (shelf._id === nodeId) {
      return shelf;
    }

    if (shelf.childrenShelvesData) {
      const parentShelf = findParentShelfRecursively(
        nodeId,
        shelf.childrenShelvesData
      );
      if (parentShelf) {
        return parentShelf;
      }
    }
  }

  return null;
}
