import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb"
import loginRoute from "./routes/login.route.js";
import signUpRoute from "./routes/signup.route.js";
import homeRoute from "./routes/home.routes.js";
import expenseRoute from "./routes/expense.route.js";
import incomeRoute from "./routes/income.route.js";




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



app.use(loginRoute)
app.use(signUpRoute)
app.use(homeRoute)
app.use(expenseRoute)
app.use(incomeRoute)





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
