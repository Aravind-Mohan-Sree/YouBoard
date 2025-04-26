import { createClient } from "redis";

// redis configuration
const redis = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
});

// listening to redis event
redis.on("error", (err) => console.error("Redis Client Error", err));

// for reconnecting to redis
redis.on("reconnecting", async () => {
  console.log("Redis disconnected");
  try {
    if (redis.isOpen === false && redis.isReady === false) {
      await redis.connect();
    }
    console.log("Redis reconnected after end");
  } catch (err) {
    console.error("Reconnection failed", err);
  }
});

const connectRedis = async () => {
  try {
    await redis.connect();
    console.log("Redis connection established");
  } catch (err) {
    console.error("Redis connection failed", err);
  }
};

export { redis, connectRedis };
