import express from "express";
import cors from "cors";
import joi from "joi";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import pkg from "mongodb";
const { MongoClient } = pkg;

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
let db = mongoClient.db("MyWallet");
let users = db.collection("users");
let sessions = db.collection("sessions");
let send = db.collection("send")

//schemas

const signUpSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
});

const sendSchema = joi.object({
  cost: joi.string().required(),
  description: joi.string().required(),
});

app.post("/signup", async (req, res) => {
  const user = req.body;

  const { error } = signUpSchema.validate(user, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    res.send(errors);
    return;
  }

  const passwordHash = bcrypt.hashSync(user.password, 10);
  await users.insertOne({ ...user, password: passwordHash });

  res.sendStatus(201);
});

app.get("/signup", async (req, res) => {
  try {
    const findUsers = await users.find().toArray();
    res.send(findUsers);
  } catch (err) {
    res.sendStatus(500);
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await users.findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = uuid();

    await sessions.insertOne({
      userId: user._id,
      token,
    });

    res.send(token);
  } else {
    res.send("erro");
  }
});

app.post("/entry", async (req, res) => {
  const { cost, description } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    res.sendStatus(401);
    return;
  }

  const session = await sessions.findOne({ token });

  if (!session) {
    res.sendStatus(401);
    return;
  }

  const user = await users.findOne({
    _id: session.userId,
  });

  const { error } = sendSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    res.send(errors);
    return;
  }
  if (user) {
    send.insertOne({
      cost,
      description,
      type: "entry",
    });
    res.sendStatus(201);
  } else {
    res.sendStatus(401);
  }
});

app.post("/exit", async (req, res) => {
  const { cost, description } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    res.sendStatus(401);
    return;
  }

  const session = await sessions.findOne({ token });

  if (!session) {
    res.sendStatus(401);
    return;
  }

  const user = await users.findOne({
    _id: session.userId,
  });

  const { error } = sendSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    res.send(errors);
    return;
  }
  if (user) {
    send.insertOne({
      cost,
      description,
      type: "exit",
    });
    res.sendStatus(201);
  } else {
    res.sendStatus(401);
  }
});

app.get("/main", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    res.sendStatus(401);
    return;
  }

  const session = await sessions.findOne({ token });

  if (!session) {
    res.sendStatus(401);
    return;
  }

  const user = await users.findOne({
    _id: session.userId,
  });

  if (user) {
    const entry = await send.find().toArray();
    res.send(entry)
  } else {
    res.sendStatus(401);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running in port: ${process.env.PORT}`)
);
