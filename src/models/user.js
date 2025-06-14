const mongooose = require("mongoose");

const userSchema = new mongooose.Schema({
    firstName : {
        type : String
    },
    lastName : {
        type : String
    },
    EmailId : {
        type : String
    },
    password : {
  type : String
    },
    age : {
        type : Number
    },
    gender : {
        type : String
    }
});



const User = mongooose.model("User", userSchema);

module.exports = User;