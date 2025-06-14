const express = require('express');
const User = require("./models/user.js")
const {connectDB} = require("./config/database.js")

const app = express();

app.use(express.json())


app.post("/signup", async(req,res) => {

    const userData = new User(req.body)
    await userData.save();

  res.send({
    mes : "User Data saved in database"
  });
})

// feed api -> get all the user from the database 

app.get("/feed",async (req,res) => {
   try {
     const allUser = await User.find({});
     if(allUser.length === 0){
        res.send("No user found")
     }
     else{
res.send(allUser)
     } 
   }catch (error) {
 res.status(400).send("Something went wrong")
   }
})

// get user by emailId
app.get("/user", async (req,res) => {
  try {
      const userEmail = req.body.EmailId;
   const checkUser = await User.findOne({ EmailId : userEmail});
   if(!checkUser){
    res.send("No user found with this emailId")
   }else{
    res.send(checkUser)
   }
  } catch (error) {
    res.status(400).send("Something went wrong user")
  }
})

// delte user Api 
app.delete("/user", async (req,res) => {
    const userId = req.body.userId;
    try {
     const userToDelete =  await User.findByIdAndDelete(userId);
     res.send("User should be deleted")
        
    } catch (error) {
        res.status(400).send("Something went wrong user delete")
    }
})

// update user api 

app.patch("/user", async (req,res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const updateData = await User.findByIdAndUpdate(userId,data, {
        new: true,           // return the *updated* doc
        runValidators: true  // enforce schema rules on update
      });
    res.send("Data should have been updated")
    } catch (error) {
        res.status(400).send("Something went wrong user update")
    }
})

// find by email and update



connectDB().then(() => {
console.log("Database connected");
app.listen(3000, () => {
  console.log('Server running on port 5000');
});
}).catch((err) => {
    console.log("Error");
})


