const express = require("express");
const {userAuth}  =   require("../middleware/auth.js")


const profileRouter = express.Router();


profileRouter.get("/profile",userAuth,(req,res) => {
  try {
res.send(req.user)    
  } catch (error) {
    res.status(401).send("Invalid or expired token");
  }
})

profileRouter.patch("/profile/edit",userAuth, async(req,res) => {
try {
  const {firstName,lastName} = req.body;
  req.user.firstName = firstName;
req.user.lastName = lastName;

  await req.user.save();
  res.send("I am also confuse what I am doing")
} catch (error) {
  
}
})

module.exports = {profileRouter}