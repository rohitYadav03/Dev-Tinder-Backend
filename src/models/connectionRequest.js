const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
fromUserId : { // sender userid 
    type : mongoose.Schema.Types.ObjectId,
    required : true
},
toUserId : { // reciver userid
    type : mongoose.Schema.Types.ObjectId,
    required : true
},
status : {    
    type : String,
    required : true,
    enum : {
        values : ["ignore", "interested", "accepted", "rejected"],
        message : `{VALUE} is wrong`
    } 
}
}, {timestamps : true})

connectionRequestSchema.index({fromUserId : 1, toUserId : 1}, {unique : true}); // explain me what does this line do

const ConnectionRequesModel = new mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = { ConnectionRequesModel };
