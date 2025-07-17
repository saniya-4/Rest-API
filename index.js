const express=require("express")
const users=require('./MOCK_DATA.json')
const app=express()
const PORT=8000

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
    const id=req.params.id;
    const user=users.find((user)=>user.id===id);
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
    res.send({status:"pending"});
})
app.listen(PORT,()=>
{
    console.log(`server started on the PORT ${PORT}`)
})