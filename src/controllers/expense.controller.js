import { sessions, users, entries } from "../index.js";
import dayjs from "dayjs";

export async function postExpense(req, res) {

  const { cost, description } = req.body;

  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);

  }

  const session = await sessions.findOne({ token });

  if (!session) {
    return res.sendStatus(401);
  }

  const user = await users.findOne({
    _id: session.userId,
  });


  if (user) {
    await entries.insertOne({
      userId: user._id,
      cost,
      description,
      type: "expense",
      time: dayjs(Date.now()).format("DD/MM")
    })
    res.sendStatus(201);
  }
  else {
    res.sendStatus(401);
  }
}