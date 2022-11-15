import express from "express"
import cors from "cors"
import dotenv from "dotenv"
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

app.listen(process.env.PORT, () =>
  console.log(`Server running in port: ${process.env.PORT}`)
);
