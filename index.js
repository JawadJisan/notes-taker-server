const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
const cors = require('cors');
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// user name: jawad
// pass: EPF7fjgGYkBXzmxB
app.use(express.json());
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oixat.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const notesCollection = client.db("notesTaker").collection("notes");


        // get api to read all notes
        // http://localhost:4000/notes
        app.get('/notes', async (req, res) => {

            const query = req.query;
            const cursor = notesCollection.find(query);

            const result = await cursor.toArray();

            res.send(result);

        });


        // creates notes Taker
        // http://localhost:4000/note
        /* 
        body{

            "username" : "jisan",
            "textData" : "Hello World?"
        }
        */
        app.post('/note',async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await notesCollection.insertOne(data);
            res.send(result);
        })



        // update notes Teker
        // http://localhost:4000/note/6269426e93bbf832d4e5f9d8
        app.put('/note/:id',async (req, res)=>{
            const id = req.params.id;
            const data = req.body;
            console.log('from put' ,data);
            const filter = { _id: ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    userName: data.userName, 
                    textData : data.textData

                },
              };
            const result = await notesCollection.updateOne(filter, updateDoc, options);
            res.send(result);




        })


        // delet notes
        // http://localhost:4000/note/6269426e93bbf832d4e5f9d8
        app.delete('/note/:id',async(req, res)=>{
            const id= req.params.id;
            const filter = { _id: ObjectId(id)};
            const result = await notesCollection.deleteOne(filter);
            res.send(result);



        })
    }
    finally {

    }
}
run().catch(console.dir);


// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
// //   client.close();
// console.log('connec')
// });


app.get('/', (req, res) => {
    res.send('Hellow World')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})