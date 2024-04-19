import mongoose from "mongoose";

const connect = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Mongo Connection successfully established.");
    } else {
      console.log("MongoDB is already connected.");
    }
  } catch (error) {
    console.error("Error connecting to Mongoose:", error.message);
    throw new Error("Error connecting to Mongoose");
  }
};

export default connect;
