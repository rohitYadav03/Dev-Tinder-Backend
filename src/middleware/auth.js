const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req,res,next) => {
    try {
           // get the token 
   const token = req.cookies.token;
   if(!token){
   throw new Error("token is not valid");
   
   }

   // validate the token 
   const decodedMsg = jwt.verify(token, "MysecreatCode18");
   if(!decodedMsg){
      throw new Error("Invalid crediantial");
   }
   // get the id from this 
   const {id} = decodedMsg;

   // get the user from this id 
   const user = await User.findById(id)

   req.user = user;
   next();
    } catch (error) {
        res.status(401).send("Unauthorized: Invalid or expired token " + error.message);
    }

}

module.exports = { userAuth };