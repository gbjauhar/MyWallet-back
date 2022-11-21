import {users} from "../index.js"
import { signUpSchema } from "../schemas/signUpSchema.js";
import bcrypt from "bcrypt"

export async function postUser(req, res) {
    const user = req.body;
  
   
   /*  const findUser = await users.findOne({user.email})
    if(findUser){
      res.send("Usuário já registrado")
    }else{ */
    const passwordHash = bcrypt.hashSync(user.password, 10);
    await users.insertOne({ ...user, password: passwordHash });
    res.send("Registrado com sucesso");
    
  }

  export async function getUser(req, res){
    try {
      const findUsers = await users.find().toArray();
      res.send(findUsers);
    } catch (err) {
      res.sendStatus(500);
    }
  }