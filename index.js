const express=require("express")
const fs=require("fs");
const users=require('./MOCK_DATA.json')
const app=express()
const PORT=8000
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>
{
    console.log("hello from middleware1");
    next();
})
app.use((req,res,next)=>
{
    fs.appendFile("log.txt",`\n${Date.now()}:${req.ip}${req.method}:${req.path}`,(err,data)=>
    {
        next();
    })
    console.log("hello from middleware 2");
    next();
})
app.get("/users",(req,res)=>
{
    const html=`
    <ul>
    ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html);
})
//REST API
app.get("/api/users",(req,res)=>
{
    return res.json(users);
})
//For getting a particular user
app.route("/api/user/:id")
.get((req,res)=>
{
    const id=Number(req.params.id);
    const user=users.find((user)=>user.id===id);
    res.send(user);
})
.put((req,res)=>
{
    res.send({status:"Pending"});
})
.delete((req,res)=>
{
    res.send({status:"pending"})
})

app.post("/api/users",(req,res)=>
{
    const body=req.body;
   users.push({...body,id:users.length+1})
   fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>
{
    res.send({status:"success",id:users.length})

})
    
})
app.listen(PORT,()=>
{
    console.log(`server started on the PORT ${PORT}`)
})