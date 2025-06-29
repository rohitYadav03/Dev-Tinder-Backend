const express = require("express");
const {userAuth} = require("../middleware/auth.js")
const userRouter = express.Router();
const {ConnectionRequesModel} = require("../models/connectionRequest.js")

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const allRequest = await ConnectionRequesModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName EmailId");

    if (allRequest.length === 0) {
      return res.status(200).json({ message: "No request found", data: [] });
    }

    res.status(200).json({ message: "Requests fetched", data: allRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.get("/user/connections", userAuth, async(req,res) => {
    // should return all the connection 
    try {
       const loggedInUser = req.user;
       const connections = await ConnectionRequesModel.find({
        $or : [
          {fromUserId : loggedInUser._id, status : "accepted"},
          {toUserId : loggedInUser._id, status : "accepted"}
        ]
       }).populate("fromUserId", "firstName lastName EmailId")
       .populate("toUserId", "firstName lastName EmailId");

      //  console.log(`connection : ${connections}`);
       

       const connectedUsers = connections.map(row => {       
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
       return row.toUserId
       } else{
        return row.fromUserId
       }   
       });
res.status(200).json({ connections: connectedUsers });


    } catch (error) {
        res.status(400).json({message : `ERROR : ${error.message}`})
    }
})


module.exports = {
    userRouter
}