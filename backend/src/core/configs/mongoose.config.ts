import mongoose from "mongoose";
import { env } from "./env.config.js";

const connectDB = () => {
  mongoose
    .connect(env.mongoose.db_uri, {})
    .then((con) => console.log(`connected to database ${con.connection.host}`))
    .catch((error) => console.log(error.message));
};

export default connectDB;
