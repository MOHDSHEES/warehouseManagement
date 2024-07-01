export const handleKeyDownInt = (event) => {
  const allowedKeys = [
    "Enter",
    "Tab",
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
  ];

  if (allowedKeys.includes(event.key)) {
    return;
  }

  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault();
  }
};

export const handleKeyDownFloat = (event) => {
  const { key, target } = event;

  // Check if the key is allowed directly
  const allowedKeys = [
    "Enter",
    "Tab",
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
  ];

  if (allowedKeys.includes(key)) {
    return;
  }

  // Prevent multiple dots (.)
  if (key === "." && target.value.includes(".")) {
    event.preventDefault();
    return;
  }

  // Allow only digits and a single dot
  if (!/^[0-9.]$/.test(key)) {
    event.preventDefault();
  }
};

// export const handleKeyDownFloat = (event) => {
//   const allowedKeys = [
//     "Enter",
//     "Tab",
//     "Backspace",
//     "Delete",
//     "ArrowLeft",
//     "ArrowRight",
//     "ArrowUp",
//     "ArrowDown",
//     ".",
//   ];

//   if (allowedKeys.includes(event.key)) {
//     return;
//   }

//   if (!/^\d*\.?\d*$/.test(event.key)) {
//     event.preventDefault();
//   }
// };
