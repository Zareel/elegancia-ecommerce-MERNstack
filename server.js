import mongoose from "mongoose";
import app from "./src/app.js";
import colors from "colors";
import config from "./src/config/index.js";

const PORT = config.PORT;

(async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URL);
    console.log(`Connected to MongoDB ${conn.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.log(`Error in Mongodb connection ${error}`.bgRed.white);
  }
})();

app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode on PORT: ${PORT}`.bgBlue
      .white
  );
});
