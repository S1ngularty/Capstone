import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const { default: app } = await import("./app.js");
import http from "http";
import path from "path";

const server = http.createServer(app);

const port = Number(process.env.PORT) || 3000;

server.listen(port, "0.0.0.0", () => {
  console.log(`SIPAT server is running on port ${port}`);
});
