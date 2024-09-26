import mongoose, { Connection } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DB: string = process.env.DB_ATLAS || "";
const connection: Connection = mongoose.connection;
const logger = (message: string): void => {
  console.log(`[Mongoose] ${message}`);
};

mongoose.connect(DB);

mongoose.set("debug", (collectionName, method, ...args) => {
  logger(`${collectionName}.${method} ${JSON.stringify(args)}`);
});

connection.on("error", (err: Error) => {
  logger(`Connection Error: ${err}`);
  process.exit(1);
});

connection.on("connected", () => {
  logger("Connection Successful with DB");
});

connection.on("disconnected", () => {
  logger("Connection Disconnected");
});

process.on("SIGINT", async () => {
  try {
    await connection.close();
    logger("Connection closed due to process termination");
    process.exit(0);
  } catch (error) {
    logger(`Error closing connection: ${error}`);
    process.exit(1);
  }
});

export default connection;
