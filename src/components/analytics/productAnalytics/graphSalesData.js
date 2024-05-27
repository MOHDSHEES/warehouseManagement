export function graphSalesData(salesHistory) {
  const salesData = [["Month", "Sales"]];
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
  const addData = (year, month, totalSales, totalPurchases) => {
    salesData.push([`${month}/${year % 100}`, totalSales]);
    purchasesData.push([`${month}/${year % 100}`, totalPurchases]);
  };

  // Fill in the available data
  salesHistorySorted.forEach((entry) => {
    addData(entry.year, entry.month, entry.sales, entry.purchases);
  });

  // Fill the remaining months with zeros
  while (salesData.length < 13) {
    const formattedMonth = currentMonth.toString().padStart(2);
    const yearShort = currentYear % 100;

    if (
      !salesData.find((data) => data[0] === `${formattedMonth}/${yearShort}`)
    ) {
      salesData.push([`${formattedMonth}/${yearShort}`, null]);
      purchasesData.push([`${formattedMonth}/${yearShort}`, null]);
    }

    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  // const sales = Array(12).fill(0);
  // const purchases = Array(12).fill(0);
  // const salesHistorySorted = [...salesHistory].sort(
  //   (a, b) => (a.year - b.year) * 12 + (a.month - b.month)
  // );

  // const recentYearSalesHistory = salesHistorySorted.filter(
  //   (entry) => entry.year === salesHistorySorted[0].year
  // );

  // // const data = [["Month", "Sales", "Purchases"]];
  // const salesData = [["Month", "Sales"]];
  // const purchasesData = [["Month", "Purchases"]];

  // recentYearSalesHistory.forEach((entry) => {
  //   const monthIndex = entry.month - 1; // month is 1-based, array index is 0-based
  //   sales[monthIndex] = entry.sales;
  //   purchases[monthIndex] = entry.purchases;
  // });

  // for (let i = 0; i < 12; i++) {
  //   const month = (i + 1).toString().padStart(2, "0");
  //   // data.push([month, sales[i], purchases[i]]);
  //   salesData.push([month, sales[i]]);
  //   purchasesData.push([month, purchases[i]]);
  // }
  return { salesData: salesData, purchasesData: purchasesData };
}
