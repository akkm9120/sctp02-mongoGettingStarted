const express = require('express');
const  mongodb = require('mongodb');
const cors = require('cors'); 

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
    const uri = "mongodb+srv://NoName1123:NoName1123@cluster0.mnrbmx6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const db = await connect(uri,"sample_mflix");

    app.get("/",async (req,res)=>{
    const results = await db.collection('movies').find({}).limit(10).toArray();
      
        res.json({
            'movies': results
    })
    })
    
}


main();

app.listen(3000,()=>{
    console.log("Server has started...")
})