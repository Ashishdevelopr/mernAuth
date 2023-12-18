const mongoose = require("mongoose");
const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = "helloworld";

const signupUser = async (req, res, next) => {
  // email id duplication validation
  let checkExistingUser;
  try {
    checkExistingUser = await userModel.findOne({ email: req.body.email });
  } catch (error) {
    console.log("User exist already");
  }

  if (checkExistingUser) {
    return res.status(400).json({ message: "User exist already" });
  }
  // email id duplication validation end

  // encrypting the password before storing in database

  const hashedPassword = bcrypt.hashSync(req.body.password);

  // adding the user after email validation and hashing the password
  const user = new userModel({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    await user.save();
  } catch (error) {
    console.log("Error while add the user", error.message);
  }

  return res.status(201).json({ message: user });
};

const loginUser = async (req, res, next) => {
  // checking if user exists or not
  const { email, password } = req.body;

  let exisitingUser;
  try {
    exisitingUser = await userModel.findOne({ email: email });
  } catch (error) {
    console.log(error);
  }

  if (!exisitingUser) {
    return res.status(400).json({ message: "User not found, Please Signup" });
  }

  // /comparing hashed password of user with given password at the time of login
  const isPasswordCorrect = bcrypt.compareSync(password, exisitingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({message: "Invalid Email / Password, Please check your credentials",});
  }

  // creating token to authorize the users access
  const loginToken = jwt.sign({ id: exisitingUser._id }, JWT_SECRET_KEY, {
    expiresIn: "10hrs",
  });

//   creating cookie using userId and token 
    res.cookie(String(exisitingUser._id), loginToken, {
        path:"/",
        expires: new Date(Date.now() + 1000*50),
        httpOnly:true,
        sameSite:"lax"
    })

  return res.status(200).json({message: "Successfully Logged In", loggedInUser: exisitingUser, loginToken,});
};

// verifying the created the token and extracting the user id 
const verifyToken = (req, res, next) => {
  const headers = req.headers["authorization"];

  const token = headers.split(" ")[1];

  if (!token) {
    return res.status(404).json({ message: "No Token found" });
  }

//   jwt.verify will verify the given token with secret key and we can extract the user id 
  jwt.verify(String(token), JWT_SECRET_KEY, (error, user) => {
    if (error) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    console.log(user.id);

    req.id = user.id;
  });
  next(); // used to run the next function written in router.get("/user", verifyToken, getUser)
};

const getUser = async (req, res, next) => {
  const userId = req.id;

  let user
  try{
    user = await userModel.findById(userId, "-password") // "-password: used to exclude the password field while getting the user document"
  }catch(error){
    console.log("Failed to get User", error.message)
  }

  if(!user){
    return res.status(400).json({message:"User not find"})
  }

  return res.status(200).json({user})
};

module.exports = { signupUser, loginUser, verifyToken, getUser };
