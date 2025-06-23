const express = require("express");
const {userAuth}  =   require("../middleware/auth.js")
const bcrypt = require("bcrypt");
const validator = require("validator")

const profileRouter = express.Router();


profileRouter.get("/profile/view",userAuth,(req,res) => {
  try {
    res.status(200).json(req.user); // Send as JSON for better structure
  } catch (error) {
    res.status(401).send("Invalid or expired token");
  }
})

profileRouter.patch("/profile/edit",userAuth, async(req,res) => {
try {
const allowedFields = [  // this re the field which we wll allow the user to update
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills"
    ];
 
    const userUpdate = Object.keys(req.body); // now userUpdate  will have all the keys that the user 
    // have passed to update and it will be an array 

    // so before saving this data we need to check wheatther the user have given the valid field to update or not we dont want user to update the 
    // email or passwod directly here 

    const validUpdate = userUpdate.every(field => allowedFields.includes(field));

    if(!validUpdate || userUpdate.length === 0){  // here we are checking that user should not have send empty body for update or unwanted field so we will throw the error
    return    res.status(400).json("Not a valid update");
    }

    // now here user have send all update field valid 
    userUpdate.forEach(field => req.user[field] = req.body[field]) 
    // we are using [] bracket because => When the key is stored in a variable


    await req.user.save();

  res.status(200).json({
  message: "Profile updated successfully",
  user: req.user
});

} catch (error) {
  res.status(400).json({
      message: "Update failed",
      error: error.message
    });

}
})

profileRouter.patch("/profile/password",userAuth, async(req,res) => {
  // this is the forgot password api or change password api 
  const {password,newPassword}  = req.body;

  if(!password || !newPassword){
          return res.status(400).json({ message: "Both current and new passwords are required" });
  }
  if (password === newPassword) {
  return res.status(400).json({ message: "New password cannot be the same as old password" });
}

  // first we need to verify that user has enter correct current password
const isValidCurrentPassword = await bcrypt.compare(password,req.user.password)
if(!isValidCurrentPassword){
  return res.status(400).json("old password doent match")
}

if(!validator.isStrongPassword(newPassword)){
  return res.status(400).json({ message: "enter a strong password" });
}

// we need to hash the password before saving it into db
const hashnewPassword = await bcrypt.hash(req.body.newPassword,10)
req.user.password = hashnewPassword
await req.user.save();
  res.send("password edit")

})

module.exports = {profileRouter}