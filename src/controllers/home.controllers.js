import { ObjectId } from "mongodb";
import { sessions, users, entries } from "../index.js";

export async function getHome(req, res) {
  try {
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
      const entry = await entries.find({ userId: session.userId }).toArray()
      res.send(entry)
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    return res.send("Não foi possível carregar as entradas")
  }
}

export async function deleteHome(req, res) {
  const { id } = req.params;
  try {
    await entries.deleteOne({ _id: ObjectId(id) });
    return res.status(200).send({ message: "Documento apagado com sucesso!" });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500)
  }
}

export async function updateHome(req, res) {
  const { id } = req.params;
  const { cost, description } = req.body
  try {
    await entries.updateOne({ _id: ObjectId(id) }, { $set: {cost, description }})
    return res.status(200).send({ message: "Documento atualizado com sucesso!" });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500)
  }
}