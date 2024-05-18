// import setAnalytics from "@/lib/analytics";
import redis from "./redis";

import { Queue, Worker } from "bullmq";
import updateProductAnalytics from "./analytics/productAnalytics";
const connection = redis;
const myQueue = new Queue("analytics", { connection });

export async function addJobs(data) {
  console.log("in addjobs");
  try {
    await myQueue.add("job", data);
    const job = await myQueue.add("job", data);
    console.log("Job added to the queue:", job.id);
  } catch (error) {
    console.log("addjobs error: ", error);
  }
}

myQueue.on("error", (error) => {
  console.error("Queue initialization error:", error);
});
myQueue.on("completed", (job) => {
  console.log("Job completed:", job.id);
});
const worker = new Worker(
  "analytics",
  async (job) => {
    console.log("in worker");
    updateProductAnalytics(job.data);
  },
  { connection }
);
worker.onmessage = (event) => {
  if (event.data && event.data.type === "connected") {
    console.log("Worker is connected.");
    // Do something when the worker is connected
  }
};

worker.onerror = (error) => {
  console.error("Worker error:", error);
};

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

// let orderQueue;
// try {
//   orderQueue = new Queue("orderQueue", {
//     redis: { url: process.env.REDIS_URL },
//   });
//   console.log(process.env.REDIS_URL);
//   console.log("Queue created successfully");
// } catch (error) {
//   console.error("Error creating queue:", error);
// }
// orderQueue.process(async (job, done) => {
//   console.log("in queue");
//   const { order, customerId, warehouseId } = job.data;
//   await updateProductAnalytics(order);
//   // await setAnalytics(order, customerId, warehouseId);
//   done();
// });

// export default orderQueue;
