import ProductAnalytics from "@/models/analyticsModels/productAnalytics";

export default async function updateProductAnalytics(orderItems) {
  try {
    console.log("in productAnalytics");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const bulkOpsUpdate = [];
    const bulkOpsInsert = [];
    // Prepare bulk operations
    for (const item of orderItems) {
      const { _id } = item;
      const quantity = item.orderData.qty;
      const price = parseInt(quantity) * parseFloat(item.orderData.price);

      const analytics = await ProductAnalytics.findOne({
        productId: _id,
        "salesHistory.year": currentYear,
        "salesHistory.month": currentMonth,
      });
      if (analytics) {
        bulkOpsUpdate.push({
          updateOne: {
            filter: {
              productId: _id,
              "salesHistory.year": currentYear,
              "salesHistory.month": currentMonth,
            },
            update: {
              $inc: {
                purchases: quantity,
                totalSales: price.toFixed(2),
                "salesHistory.$[elem].sales": price.toFixed(2),
                "salesHistory.$[elem].purchases": quantity,
              },
              $set: { lastPurchased: currentDate },
            },
            arrayFilters: [
              { "elem.year": currentYear, "elem.month": currentMonth },
            ],
          },
        });
      } else {
        bulkOpsInsert.push({
          updateOne: {
            filter: { productId: _id },
            update: {
              $inc: { purchases: quantity, totalSales: price.toFixed(2) },
              $set: { lastPurchased: currentDate },
              $push: {
                salesHistory: {
                  year: currentYear,
                  month: currentMonth,
                  sales: price.toFixed(2),
                  purchases: quantity,
                },
              },
            },
            upsert: true,
          },
        });
      }
    }

    // Execute bulk operations
    bulkOpsUpdate.length && (await ProductAnalytics.bulkWrite(bulkOpsUpdate));

    // Handle inserts where no sales history entry exists
    bulkOpsInsert.length && (await ProductAnalytics.bulkWrite(bulkOpsInsert));
  } catch (err) {
    console.error("Error updating product analytics:", err);
  }
}
