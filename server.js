import express from "express";
const app = express();
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
const PORT = process.env.PORT || 3000;

//configure env
dotenv.config();

//database config
connectDB();

//middleware
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send(`<h1>Server is up and running</h1>`);
});

app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode on PORT: ${PORT}`.bgBlue
      .white
  );
});
