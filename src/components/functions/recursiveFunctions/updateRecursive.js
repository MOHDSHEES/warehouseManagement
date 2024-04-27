export default function updateShelvesRecursively(shelves, nodeId, newData) {
  return shelves.map((shelf) => {
    if (shelf._id === nodeId) {
      return { ...shelf, childrenShelvesData: newData };
    }

    if (shelf.childrenShelvesData) {
      const updatedChildren = updateShelvesRecursively(
        shelf.childrenShelvesData,
        nodeId,
        newData
      );
      return { ...shelf, childrenShelvesData: updatedChildren };
    }

    return shelf;
  });
}

export function updateShelfName(shelves, nodeId, newData) {
  return shelves.map((shelf) => {
    if (shelf._id === nodeId) {
      return { ...shelf, ...newData };
    }

    if (shelf.childrenShelvesData) {
      const updatedChildren = updateShelfName(
        shelf.childrenShelvesData,
        nodeId,
        newData
      );
      return { ...shelf, childrenShelvesData: updatedChildren };
    }

    return shelf;
  });
}
