const express = require("express");
const {userAuth}  =   require("../middleware/auth.js");
const {ConnectionRequesModel} = require("../models/connectionRequest.js");
const User = require("../models/user.js")


const requestRouter = express.Router();

// sendconnectionRequest
// Send connection request
requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;        // ObjectId
    const toUserId   = req.params.userId;   // string
    const { status } = req.params;          // "ignore" | "interested"

    // 1. Basic validation
    if (!fromUserId || !toUserId) {
      return res.status(400).json({ message: "Invalid request" });
    }
    if (!["ignore", "interested"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    // 2. Make sure the recipient exists
    const validUser = await User.findById(toUserId);
    if (!validUser) {
      return res.status(400).json({ message: "Not a valid userId" });
    }

    // 3. Does a request between these two users already exist?
    const existingRequest = await ConnectionRequesModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    // 4. Create the request
    await new ConnectionRequesModel({ fromUserId, toUserId, status }).save();
    return res.status(201).json({ message: "Request sent" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});



module.exports = {requestRouter};