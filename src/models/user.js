const mongooose = require("mongoose");
const validator = require("validator");


const userSchema = new mongooose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 2,
        maxLength : 30
    },
    lastName : {
        type : String,
        minLength : 3,
        maxLength : 50
    },
    EmailId : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
        validate(val){
            if (!validator.isEmail(val)) {
                throw new Error("Enter a valid email");
            }
        }
    },
    password : {
  type : String,
  required : true,
 validate(val){
    if(!validator.isStrongPassword(val)) {
        throw new Error("Enter a strong password of Minumum 8 length, Uper case , Lower Case , number , symbol ");
    }
 }
    },
    age : {
        type : Number,
        min : 18
    },
    gender : {
        type : String,
        lowercase : true,
      validate(value){
        if(!["male", "female", "other"].includes(value)){
            throw new Error("Invalid Gender");  
        }
      }
    },
    photoUrl : {
        type : String,
        default : "https://geographyandyou.com/images/user-profile.png",
       validate(val){
        if(!validator.isURL(val)){
            throw new Error("Enter a valid URL");
        }
       }
    },
    about : {
        type : String,
        default : "This is default info about user"
    },
    skills : {
        type : [String],
        default : [],
       validate : [
        {
            validator : function(val){
                return  val.length <= 10
            },
          message: 'Skills must have between 1  10 items.'
        },
        {
            validator : function(val){
                return val.every(str => str.length <= 30);
            },
          message: 'Each skill must be 30 characters or less.'
        }
       ]
    }
}, {timestamps : true});



const User = mongooose.model("User", userSchema);

module.exports = User;