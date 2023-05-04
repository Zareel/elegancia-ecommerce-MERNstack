# Ecommerce App

## installation

- express
- mongoose
- dotenv
- nodemon

## create server, setup dotenv file

- server.js

```js
import express from "express";
const app = express();
import colors from "colors";
import dotenv from "dotenv";
const PORT = process.env.PORT || 3000;

//configure env
dotenv.config();

app.get("/", (req, res) => {
  res.send(`<h1>Server is up and running, Welcome the shop</h1>`);
});

app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode on PORT ${PORT}`.bgBlue
      .white
  );
});
```

- run the server
  `npm run server`

## Connect to database

- [npm install mongoose](https://mongoosejs.com/docs/)
- Mongoose.module is one of the most powerful external module of the node.js. Mongoose is a MongoDB ODM (Object database Modelling) that is used to translate the code and its representation from MongoDB to the Node.js server.

- `config/db.js`

```js
import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to MongoDB database ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in MongoDB ${error}`.bgRed.white);
  }
};

export default connectDB;
```

### install morgan

- [npm install morgan](https://www.npmjs.com/package/morgan)
- Morgan is an HTTP request level Middleware. It is a great tool that logs the requests along with some other information depending upon its configuration and the preset used. It proves to be very helpful while debugging and also if you want to create Log files.

- `server.js`
- import morgan

```js
import morgan from "morgan";

//middleware
app.use(morgan("dev"));
```

- In the above code, we set up morgan, and since it’s a middleware, So we used the .use() method to tell express to use that as a middleware in our app. Other than that we have used ‘dev’ as a preset.

- enable json

```js
app.use(express.json());
```

- import connectDB from "./config/db.js" and call the function

```js
import connectDB from "./config/db.js";
connectDB();
```

- now our server.js will look like this 👇
- `server.js`

```js
import express from "express";
const app = express();
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
const PORT = process.env.PORT || 3000;

//configure env
dotenv.config();

//database config
connectDB();

//middleware
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send(`<h1>Server is up and running, Welcome the shop</h1>`);
});

app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode on PORT ${PORT}`.bgBlue
      .white
  );
});
```

### DB Connection complete

- run the application `npm run server`
