const express = require('express');
const User = require("./models/user.js")
const {connectDB} = require("./config/database.js")
const {validateSignup} = require("./utils/validation.js")
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json())

app.post("/signup", async(req,res) => {

  const { firstName, lastName, EmailId, password } = req.body;

  try {
    // validae the user data before saving to database
    validateSignup(req);

// now hash the password
const hashPassword = await bcrypt.hash(password,10);
console.log(hashPassword);

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
    res.send("email already register");
  }else{
    res.status(400).send({ error: err.message });

  }
  }
});

// login API 
app.post("/login", async(req,res) => {
  try {
     const { EmailId, password } = req.body;
  const userData = await User.findOne({EmailId : EmailId});

if(!userData){
throw new Error("Email Id is not register");
}
if(!password){
  throw new Error("Enter password");
}

const validPassword = await bcrypt.compare(password, userData.password);

if(validPassword){
  res.send("Login successfully")
}else{
  throw new Error("Incorrect Password")
}
  } catch (error) {
    res.send(`ERROR : ${error.message}`)
  }
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
        const ALLOWED_UPDATE = ["photoUrl", "about", "gender", "age","skills", "userId"];
    
const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATE.includes(k));

if(!isUpdateAllowed){
  throw new Error("update not allowed ");
}

if(data.skills?.length > 10){
    throw new Error("skill should be less than 10");
}

        const updateData = await User.findByIdAndUpdate(userId,data, {
        new: true,           // return the *updated* doc
        runValidators: true  // enforce schema rules on update
      });
    res.send("Data should have been updated")
    } catch (error) {
        res.status(400).send("Something went wrong user update  " + error.message)
    }
})

// find by email and update
app.patch("/user/:email", async(req,res) => {
      
const updateUser = await User.findOneAndUpdate({EmailId : req.params.email}, req.body) 
res.send(updateUser);
})


connectDB().then(() => {
console.log("Database connected");
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
}).catch((err) => {
    console.log("Error");
})


