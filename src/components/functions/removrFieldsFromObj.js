export default function removeFields(obj, fieldsToRemove) {
  const newObj = {};

  for (const key in obj) {
    if (fieldsToRemove.includes(key)) {
      continue;
    }

    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      newObj[key] = removeFields(obj[key], fieldsToRemove);
    } else if (Array.isArray(obj[key])) {
      newObj[key] = obj[key].map((item) =>
        typeof item === "object" ? removeFields(item, fieldsToRemove) : item
      );
    } else {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}
