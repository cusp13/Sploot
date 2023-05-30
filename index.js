require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require('./models/blog')

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const app=express();
const PORT = process.env.PORT || 8000;

mongoose.connect("mongodb://127.0.0.1:27017/blogify")
.then(e=>console.log("MongoDB connected"))
.catch((err)=>console.log(err));

app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

app.get("/",async(req,res)=>{
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs
    });
})

app.use("/api",userRoute);
app.use("/blog",blogRoute);

app.listen(9001, ()=>{
    console.log(`Server started at port: ${PORT}`)
})