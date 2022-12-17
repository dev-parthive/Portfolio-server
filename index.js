const express  = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');


require('colors')
require('dotenv').config()

// middle ware 
app.use(cors())


// make connection with db 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.afdwhlk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function dbConnect(){
    try{
         await client.connect()
         console.log("Database connected". yellow.bold)

    }
    catch(err){
        console.log(err.name.bgRed, err.message.bold, err.stack)

    }
}
dbConnect()
// make collection 
const projectsCollection = client.db("Portfolio").collection("Projects")
// end point 
app.get('/projects', async(req, res)=>{
    try{
        const query = {}
        const porjects = await projectsCollection.find(query).toArray()
        res.send(porjects)
    }
    catch(err){
        console.log(`${err.message}`.bgRed)
        res.send({
            success: false,
            error: err.message
        })
    }
})

//get data using dynamic id 
app.get('/project/:id', async(req, res)=>{
    try{
        const id = req.params.id
        // console.log(id)
        const query = {id: (id)}
        const cursor = await projectsCollection.find(query)
        const project = await cursor.toArray() 
        res.send({
            success: true, 
            data: project
        })
    }
    catch(err){
        res.send({
            success: false,
            error: err.message
        })
    }
})
app.get('/' , (req, res)=>{
    res.send("Portfolio server is running.....")
})
app.listen(port , ()=>{
    console.log(`Portfolio server is running on ${port}`.blue)
})