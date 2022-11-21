import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "mongodb";
import router from "./routes.js";
const { MongoClient, ObjectId } = pkg;


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
export const db = mongoClient.db("MyWallet");
export const users = db.collection("users");
export const sessions = db.collection("sessions");
export const entries = db.collection("entries")



app.use(router)





app.delete("/home/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await entries.deleteOne({ _id: ObjectId(id) });
    res.status(200).send({ message: "Documento apagado com sucesso!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running in port: ${process.env.PORT}`)
);
