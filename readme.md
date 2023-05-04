# Ecommerce App

## initialize node application

- npm init
- [npm install express](https://www.npmjs.com/package/express)
- server.js file in the root folder

## create server

- `server.js` 👇

```js
import express from "express";
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
```

### Run application `npm run server`

## setup dotenv file

- [npm install dotenv](https://www.npmjs.com/package/dotenv)
- dotenv is a zero dependency module that loads environmental variables from `.env` file into `process.env`
- Once you have DotEnv installed and configured, make a file called .env at the top level of your file structure. This is where you will create all of your environment variables, written in the `NAME=value` format. For example, you could set a port variable to 3000 like this: `PORT=3000`.
- you can access the variables using the pattern `process.env.KEY`.
- Add the file to .gitignore to avoid pushing it to a public repo accidentally.
- import dotenv in `server.js` and configure

- `server.js` 👇

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

### create `config` folder

- `config/db.js` 👇

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

- `server.js` 👇
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

// either grab your PORT from process.env.PORT((environmet variable) or use the PORT 3000
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

## Create authRoles

- create folder `utils` and file `authRoles.js` inside it
- `authRoles.js` 👇

```js
const authRoles = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  USER: "UESR",
  SELLER: "SELLER",
};

export default authRoles;
```

## Create Schemas

- [docs](https://mongoosejs.com/docs/guide.html)

- create folder `model` and respective files for schemas

- `user.schema.js` 👇

```js
import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [32, "Name must be less than 32 chars"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [true, "Password must be atleast 8 chars"],
      select: false,
      // select:false => good practice, whenever you extact information of the user from the database it won't bring password by defalut
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      //enum => restricting the user's options that we they can save in the database (you can select from these options only).
      //Object.values => The Object.values() static method returns an array of a given object's own enumerable string-keyed property values.
      default: AuthRoles.USER,
      // Whenever there is an object being created in the database, we will name it as USER, if nobody passes me anything extra
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    //if the provided  email is found in our database, we create a unique token(link) and save one copy in our database send another copy  to the user's email, if the user clicks on that link, we take that token and match it with the database.
    // if the token that we send to the user matches with our database, then we can allow the user to change the password within a time limit
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
```

### install bcryptjs

- [npm install bcryptjs](https://www.npmjs.com/package/bcryptjs)
