const mongooose = require("mongoose");


const connectDB = async() => {
   await mongooose.connect("mongodb+srv://rohityadav85801:ApkSBvXBgdOlE5JW@originaltinder.xae1zzc.mongodb.net/devTinder");
}

module.exports = { connectDB}
