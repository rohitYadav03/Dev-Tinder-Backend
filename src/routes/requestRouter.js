const express = require("express");
const {userAuth}  =   require("../middleware/auth.js")


const requestRouter = express.Router();

// sendconnectionRequest
requestRouter.post("/sendConnectionRequest", userAuth, (req,res) => {
  try {
    const user = req.user;
    res.send(`${user.firstName} send the connection request`)
  } catch (error) {
        res.status(401).send("Invalid or expired token");
  }
})


module.exports = {requestRouter};