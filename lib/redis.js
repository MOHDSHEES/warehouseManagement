import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
redis.ping((err, result) => {
  if (err) {
    console.error("Error connecting to Redis:", err);
  } else {
    console.log("Redis connection successful:", result);
  }
});

export default redis;
