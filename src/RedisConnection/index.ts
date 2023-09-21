import Redis from "ioredis";

const redis = new Redis({
  host: "singapore-redis.render.com",
  port: 6379,
  password: "jI8SAd97U6caKneT2CjVgemL8Dhuidv2",
  tls: {
    servername: "singapore-redis.render.com"
  }
})

redis.ping((err, result) => {
    if (err) {
        console.error("Error connecting to Redis:", err);
    } else {
        console.log("Connected to Redis:", result);
    }
});

export { redis }