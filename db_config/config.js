import mongoose from "mongoose";
import colors from 'colors'
//function mmongodb dfatabase connection
export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected To Database ${mongoose.connection.host}`.bgBlue);
  } catch (e) {
    console.log(`DB-Error: ${e.message}`.bgRed);
  }
};