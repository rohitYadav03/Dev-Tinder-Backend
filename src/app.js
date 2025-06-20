const express = require('express');
const User = require("./models/user.js")
const {connectDB} = require("./config/database.js")
const {validateSignup} = require("./utils/validation.js")
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth}  =   require("./middleware/auth.js")
const app = express();

app.use(express.json())
app.use(cookieParser())

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
    res.send(`ERROR : ${error.message}`)
  }
})

app.get("/profile",userAuth,(req,res) => {
  try {
res.send(req.user)    
  } catch (error) {
    res.status(401).send("Invalid or expired token");
  }
})

// sendconnectionRequest
app.post("/sendConnectionRequest", userAuth, (req,res) => {
  try {
    const user = req.user;
    res.send(`${user.firstName} send the connection request`)
  } catch (error) {
        res.status(401).send("Invalid or expired token");
  }
})

connectDB().then(() => {
console.log("Database connected");
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
}).catch((err) => {
    console.log("Error");
})


