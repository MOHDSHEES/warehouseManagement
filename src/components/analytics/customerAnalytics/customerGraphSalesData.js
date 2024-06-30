// export function CustomergraphSalesData(salesHistory) {
//   const spent = Array(12).fill(0);
//   const purchases = Array(12).fill(0);
//   const recentYearSalesHistory = salesHistory.filter(
//     (entry) => entry.year === salesHistory[0].year
//   );
//   //   const data = [["Month", "Spent", "Purchases"]];
//   const spentData = [["Month", "Spent"]];
//   const purchasesData = [["Month", "Purchases"]];

//   recentYearSalesHistory.forEach((entry) => {
//     const monthIndex = entry.month - 1; // month is 1-based, array index is 0-based
//     spent[monthIndex] = entry.totalSpent;
//     purchases[monthIndex] = entry.totalPurchases;
//   });

//   for (let i = 0; i < 12; i++) {
//     const month = (i + 1).toString().padStart(2, "0");
//     // data.push([month, spent[i], purchases[i]]);
//     spentData.push([month, spent[i]]);
//     purchasesData.push([month, purchases[i]]);
//   }

//   return { spentData: spentData, purchasesData: purchasesData };
// }

export function CustomergraphSalesData(salesHistory) {
  //   const spentData = [];
  //   const purchasesData = [];
  const spentData = [["Month", "Spent"]];
  const purchasesData = [["Month", "Purchases"]];

  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth() + 1;

  // Sort salesHistory by year and month
  const salesHistorySorted = [...salesHistory].sort(
    (a, b) => (a.year - b.year) * 12 + (a.month - b.month)
  );

  //   console.log(salesHistorySorted);
  // Function to add data to the arrays
  const addData = (year, month, totalSpent, totalPurchases) => {
    spentData.push([`${month}/${year % 100}`, totalSpent]);
    purchasesData.push([`${month}/${year % 100}`, totalPurchases]);
  };

  // Fill in the available data
  salesHistorySorted.forEach((entry) => {
    addData(entry.year, entry.month, entry.totalSpent, entry.totalPurchases);
  });

  // Fill the remaining months with zeros
  while (spentData.length < 13) {
    const formattedMonth = currentMonth.toString().padStart(2);
    const yearShort = currentYear % 100;

    if (
      !spentData.find((data) => data[0] === `${formattedMonth}/${yearShort}`)
    ) {
      spentData.push([`${formattedMonth}/${yearShort}`, null]);
      purchasesData.push([`${formattedMonth}/${yearShort}`, null]);
    }

    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  return { spentData: spentData, purchasesData: purchasesData };
}
