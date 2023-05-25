import {users} from "../index.js"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid";
import { sessions } from "../index.js";

export async function postLogin(req, res) {
    const { email, password } = req.body;
  
    const user = await users.findOne({ email });
  
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
  
      await sessions.insertOne({
        userId: user._id,
        token,
      });
  
      const body = {...user, token:token}
      res.send(body);
    } else {
      res.status(404).send("Algo deu errado");
    }
  };