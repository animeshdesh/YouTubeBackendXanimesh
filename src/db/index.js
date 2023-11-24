import mongoose from "mongoose";

import { DB_NAME } from "../constant.js";

// Always remember to run the DB connection function in async way because
// as server is situated in different continent it make take some time to
// connect to it and so it is also important to use try catch

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB Connected !! Host Name: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB Connection FAILED", error);
    process.exit(1);
  }
};

export default connectDB;
