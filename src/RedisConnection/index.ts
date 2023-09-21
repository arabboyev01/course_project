import Redis from "ioredis";

const redis = new Redis({
  host: "redis://red-ck62v2b6fquc73c16lp0",
  port: 6379
})
redis.ping((err, result) => {
    if (err) {
        console.error("Error connecting to Redis:", err);
    } else {
        console.log("Connected to Redis:", result);
    }
});

export { redis }