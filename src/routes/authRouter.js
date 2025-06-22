const express = require("express");
const {validateSignup} = require("../utils/validation.js")
const bcrypt = require('bcrypt');
const User = require("../models/user.js")
const jwt = require("jsonwebtoken");


const authRouter = express.Router();

// signup route
authRouter.post("/signup", async(req,res) => {
const { firstName, lastName, EmailId, password } = req.body;
  try {
    // validae the user data before saving to database
    validateSignup(req);
// now hash the password
const hashPassword = await bcrypt.hash(password,10);

    const userData = new User({
      firstName,
      lastName,
      EmailId,
      password : hashPassword
    });
    await userData.save();
    res.status(201).send({ message: "User saved to database" });
  } catch (err) {
      if (err.code === 11000) {
    res.status(409).send({ error: "Email already registered" });
  }else{
    res.status(400).send({ error: err.message });
  }
  }
});

// login API 
authRouter.post("/login", async(req,res) => {
  try {
 const { EmailId, password } = req.body;
  const userData = await User.findOne({EmailId : EmailId.toLowerCase()});

if(!userData){
throw new Error("Email Id is not register");
}
if(!password){
  throw new Error("Enter password");
}

const validPassword = await bcrypt.compare(password, userData.password);

if(validPassword){
//  First create the token
// Then send it in a cookie
// Then send a success response

// token created here
 const token = jwt.sign({id : userData._id},"MysecreatCode18", {expiresIn : "7d"});

const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);


 // send the cookie
 res.cookie("token", token, {
  httpOnly : true,
  secure : false , // true in production -> it means HTTPS
  sameSite: "strict",
  expires :  expiryDate
 })

  res.send("Login successfully");
}else{
  throw new Error("Incorrect Password")
}
  } catch (error) {
 res.status(400).send({ error: error.message });
  }
})

authRouter.post("/logout", (req,res) => {
       res.clearCookie("token", {
  httpOnly : true,
  secure : false , // true in production -> it means HTTPS
  sameSite: "strict",
 })
 res.status(200).json({ message : "Logout success"})
})

module.exports = {authRouter}