const express = require('express');
const  mongodb = require('mongodb');
const cors = require('cors'); 
require('dotenv').config(); 

const MongoClient = mongodb.MongoClient;

const app = express();
app.use(cors());

app.use(express.json());


async function connect(uri, dbname){
    const client = await MongoClient.connect(uri,{
        useUnifiedTopology:true
    });
    let db = client.db(dbname);
    return db; 
} 

async function main(){
    const uri = process.env. MONGO_URI;
    const db = await connect(uri,"sctp02_food_sighting");
        
    app.get("/",async (req,res)=>{
    const results = await db.collection('sighting').find({}).limit(10).toArray();
      
        res.json({
            'movies': results
    })
    })

    app.post("/food-sighting", async (req,res)=>{
        try{
        const description = req.body.description;
        const food = req.body.food;
        const datetime = req.body.datetime || new Date();
        const result = await db.collection("sighting").insertOne({
            'description' : description,
            'food': food,
            'datetime':datetime
        });
        res.json({
            'results': result
        })
    } catch (e) {
        res.status(500);
        res.json({
            "error": e
        })
    }
})
    
}


main();

app.listen(3001,()=>{
    console.log("Server has started...")
})