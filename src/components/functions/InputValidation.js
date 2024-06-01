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
