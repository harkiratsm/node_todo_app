const express=require('express')
const mongoose=require('mongoose')
const Todo=require('./models/Todo');
const axios =require('axios')
const app=express();
const bodyParser=require('body-parser')
const port=process.env.PORT || 5000
require('dotenv').config()

mongoose.connect(process.env.DB_URL,{useNewUrlParser:true,useUnifiedTopology: true},()=>{
    console.log("mongoose todo database connected")
})

app.set("view engine","ejs")
app.use(express.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/',async(req,res)=>{
    let todo=[];
    await axios.get('https://cryptic-spire-79696.herokuapp.com/getall')
                    .then((res)=>{
                        todo=res.data;
                        
                    })
                    .catch((error)=>{
                        console.log(error)
                    })
   
    res.render('home',{todo:todo})
    
})

app.get("/delete/:todoid",async (req, res) => {
    
    await Todo.deleteOne({_id:req.params.todoid})
      .then(() => {
        console.log("Deleted Todo Successfully!");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  });
app.get("/getall",async(req,res)=>{
    try{
        const todo=await Todo.find();
        res.json(todo)
    }
    catch (error){
        res.send({message:error})
    }
})
app.get('/get', async(req,res)=>{
    try {
        const todo=await Todo.findById({_id:req.params.todoid})
        
    } catch (error) {
        console.log({message:json})
    }
})
app.post('/add',async(req,res)=>{
    
    const savedtodo=new Todo({
        todo:req.body.todo
    })

    const todo=await savedtodo.save();
    res.redirect("/")
})
app.patch("/patch/:todoid",async (req,res)=>{
    try {
        const pat=await Todo.updateOne({_id:req.params.todoid},{$set:req.body})
        res.send(pat);
    } catch (error) {
        res.send({message:error})
    }
})

app.delete("/deleteall", async (req,res)=>{
    try {
        await Todo.deleteMany({},(error)=>{
            if(!error){
                console.log("all items deleted")
            }
            else{
                res.json({message:error})
            }
        })
    } catch (error) {
        res.json({message:error})
    }
    
})
app.listen(port,
    (error)=>{
        if(!error){
            console.log(`http://localhost:${port}`)
        }
        else{
            console.log("Error connecting")
        }
})

