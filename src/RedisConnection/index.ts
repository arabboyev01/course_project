import Redis from "ioredis";

const redis = new Redis();

redis.ping((err, result) => {
    if (err) {
        console.error("Error connecting to Redis:", err);
    } else {
        console.log("Connected to Redis:", result);
    }
});

export { redis }