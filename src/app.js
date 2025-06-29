const express = require('express');
const {connectDB} = require("./config/database.js")
const cookieParser = require("cookie-parser");
const {authRouter} = require("./routes/authRouter.js")
const {profileRouter}  = require("./routes/profileRouter.js")
const {requestRouter} = require("./routes/requestRouter.js");
const {userRouter} = require("./routes/user.js")

const app = express();

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter);      // handles /profile
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB().then(() => {
console.log("Database connected");
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
}).catch((err) => {
    console.log("Error");
})


