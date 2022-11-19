import express from "express"
import cors from "cors"
import joi from "joi"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import { v4 as uuid } from 'uuid';
import pkg from "mongodb"
const {MongoClient} = pkg



const app = express();

//configs
dotenv.config();
app.use(express.json());
app.use(cors());

//connection to database
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect().then(() => console.log("conectado"));
mongoClient.connect().catch((err) => console.log(err));

//database and collections
let db = mongoClient.db("MyWallet")
let users = db.collection("users")
let entries = db.collection("entries")
let exits = db.collection("exits")

//schemas

const signUpSchema = joi.object({ 
  name: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required()
 })

 const token = uuid();
 app.post("/signup", async (req, res) => {

  const user = req.body;

  const {error} = signUpSchema.validate(user, {abortEarly: false})
  if(error){
    const errors = error.details.map((detail) => detail.message)
    res.send(errors)
    return
  }
  
  const passwordHash = bcrypt.hashSync(user.password, 10);
  await users.insertOne({ ...user, password: passwordHash }) 


  res.sendStatus(201);
});

app.get("/signup", async (req, res) => {
try{
  const findUsers = await users.find().toArray()
  res.send(findUsers)
}catch(err){
  res.sendStatus(500)
}
})



app.listen(process.env.PORT, () =>
  console.log(`Server running in port: ${process.env.PORT}`)
);
