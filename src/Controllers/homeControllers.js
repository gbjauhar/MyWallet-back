import { sessions, users, entries } from "../index.js";

export async function getHome(req, res) {
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
  
  
    if(user){
      const entry = await entries.find().toArray()
      res.send(entry)
    } else {
      res.sendStatus(401);
    }
  }

  export async function deleteHome(req, res){
    const { id } = req.params;
    try {
      await entries.deleteOne({ _id: ObjectId(id) });
      res.status(200).send({ message: "Documento apagado com sucesso!" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err.message });
    }
  }