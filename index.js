const express=require("express")
const mongoose=require("mongoose")
const fs=require("fs");
// const users=require('./MOCK_DATA.json');
const { timeStamp } = require("console");
const app=express()
const PORT=8000
mongoose.connect("mongodb://127.0.0.1:27017/app-1").then(()=>console.log("MongoDb connected")).catch((err)=>
    console.log("error",err)
);
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:false,

    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    jobTitle:{
        type:String,
        
    },
    gender:{
        type:String
    }

},{timestamps:true})
const User=mongoose.model("user",userSchema);
app.use(express.urlencoded({extended:true}));
app.use(express.json({extended:true}))
app.use((req,res,next)=>
{
    console.log("hello from middleware1");
    next();
})
app.use((req,res,next)=>
{
   fs.appendFile("log.txt", `\n${Date.now()}:${req.ip} ${req.method}:${req.path}`, (err) => {
        if (err) {
            console.error("Logging error:", err);
        }
        console.log("hello from middleware 2");
        next(); // ✅ Always call next after log write
    });
   
})
app.get("/users",async(req,res)=>
{
    const AlldbUsers=await User.find({});
    const html=`
    <ul>
    ${AlldbUsers.map((user)=>`<li>${user.firstName}- ${user.email}</li>`).join("")}
    </ul>
    `
    res.send(html);
})
//REST API
app.get("/api/users",async(req,res)=>
{
    const allDbUsers=await User.find({})
    // console.log(req.headers);
     res.setHeader("X-myname","saniya");
    return res.json(allDbUsers);
})
//For getting a particular user
app.route("/api/user/:id")
.get(async(req,res)=>
{
    const user=await User.findById(req.params.id);
    if(!user)
    {
        return res.status(400).json({error:"no user found"})
    }
    res.send(user);
})
.patch(async(req,res)=>
{
    await User.findByIdAndUpdate(req.params.id,{lastName:"Hey"});
    res.send({status:"success"});
})

.delete(async(req,res)=>
{
    await User.findByIdAndDelete(req.params.id);
    res.send({status:"pending"})
})

app.post("/api/users",async(req,res)=>
{
    const body=req.body;
    if(!body|| !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title)
    {
        return res.status(400).json({msg:"All feilds are required"})
    }
    const result=await User.create({
        firstName:body.first_name,
        lastName:body.last_name,
        email:body.email,
        gender:body.gender,
        jobTitle:body.job_title,


    });
    console.log(result); 
    return res.status(201).json({msg:"success"});
    
})
app.listen(PORT,()=>
{
    console.log(`server started on the PORT ${PORT}`)
})