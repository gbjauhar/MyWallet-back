import { users } from "../index.js"
import bcrypt from "bcrypt"

export async function postUser(req, res) {
  try {
    const { email, password, name } = req.body;
    const findUser = await users.findOne({ email })
    if (findUser) {
      res.status(401).send("Usuário já registrado!")
    } else {
      const passwordHash = bcrypt.hashSync(password, 10);
      await users.insertOne({ name, email, password: passwordHash });
      res.send("Registrado com sucesso");

    }
  } catch (err) {
    console.log(err)
  }
}