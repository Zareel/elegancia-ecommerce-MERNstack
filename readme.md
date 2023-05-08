# MERN Stack Ecommerce App

## initialize node application

- npm init
- [npm install express](https://www.npmjs.com/package/express)

### Create server.js file at the top level of your file structure

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
import dotenv from "dotenv";

// either grab your PORT from process.env.PORT(environmet variable) or use the PORT 3000
const PORT = process.env.PORT || 3000;

//configure env
dotenv.config();

app.get("/", (req, res) => {
  res.send(`<h1>Server is up and running.</h1>`);
});

app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode on PORT ${PORT}`
  );
});
```

- run the server
  `npm run server`

## Connect to database

- [npm install mongoose](https://mongoosejs.com/docs/)
- Mongoose.module is one of the most powerful external module of the node.js. Mongoose is a MongoDB ODM (Object database Modelling) that is used to translate the code and its representation from MongoDB to the Node.js server.

### create `config` folder and `db.js` file inside it

- `config/db.js` 👇

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to MongoDB database ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in MongoDB ${error}`);
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
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";

// either grab your PORT from process.env.PORT(environmet variable) or use the PORT 3000
const PORT = process.env.PORT || 3000;

//configure env
dotenv.config();

//database config
connectDB();

//middleware
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send(`<h1>Server is up and running</h1>`);
});

app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode on PORT ${PORT}`
  );
});
```

### DB Connection complete

- run the application `npm run server`

## Create authRoles

### create folder `utils` and file `authRoles.js` inside it

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

## Create userSchema

- [docs](https://mongoosejs.com/docs/guide.html)

### create folder `model` and respective files for Schemas

- `model/userModel.js` 👇

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
      trim: true,
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
/*
### timestamps => 
- mongoose schemas support a timestamps option.
- if you set `timestamps: true`, Mongoose will add two properties of type `Date` to your schema
1. createdAt: A date representing when this document is created
2. updatedAt: A date representing when this document is updated
*/
export default mongoose.model("User", userSchema);
```

## create userRoute

### Create forder called `routes` and file called `authRoute.js` inside it

- `authRoute.js` 👇

```js
import express from "express";
import { signUpController } from "../controllers/authConroller.js";

//router object
const router = express.Router();

// routing
// signUp || method: post

router.post("/signup", signUpController);

export default router;
```

### import `authRoutes` in `server.js` 👇

```js
import authRoutes from "./routes/authRoute.js";
//routes
app.use("/api/v1/auth", authRoutes);
```

### install bcryptjs

- [npm install bcryptjs](https://www.npmjs.com/package/bcryptjs)

### create new folder `helpers` and `authHelper.js` file inside it

- create two functions, one is for encrypt password and other one is for comparing password
- `authHelper.js` 👇

```js
import bcrypt from "bcryptjs";
// hash password
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};
//compare password
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
```

## setup Controller for user

### Create the folder `controller` and file `authController.js`

- check if the user is existing
- if user exists thow an error
- if user not exists encrypt password and save the user info in the database
- `authController.js` 👇

```js
import { hashPassword } from "../helpers/authHelper.js";
import User from "../models/userModel.js";

export const signUp = async (req, res) => {
  //get data from the user
  const { name, email, password, phone, address } = req.body;
  //validation
  if (!name || !email || !password || !phone || !address) {
    throw new Error("Required field");
  }
  try {
    //check if the user already exists
    const existingUser = await User.findOne({ email });
    //if user already exists, thorw an error
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "Already signed Up, Please login",
      });
    }
    // signUp user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in signUp",
      error,
    });
  }
};
```

## create login route

- [npm install jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- create secret key in .env file

- import JWT in `controllers/authcontroller.js`
- create loginController function
- validate email and password
- check user, if not exist in database send resopnse
- match password, if not matching, send response

- [docs](https://mongoosejs.com/docs/queries.html)
- Mongoose models provide static helper function for `CRUD operations`. Each of these functions returns a mongoose query object

```js
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //compare password
    const match = await comparePassword();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
```

- `routes/authRoute.js` 👇

```js
import express from "express";
import { signUp, login } from "../controllers/authConroller.js";

//router object
const router = express.Router();

// routing
// signUp || method: post
router.post("/signup", signUp);

//login || POST
router.post("/login", login);

export default router;
```

## JWT

- JWT is a long encrypted string as a token
- it is made up of header(algorithm & token type), payload(data), secret(verify signature) and validity period
- whoever has the access to the sectret can decrypt the value

- authController.js

```js
//token
const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});
res.status(200).send({
  success: true,
  message: "login successfully",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    adddress: user.address,
  },
  token,
});
```
