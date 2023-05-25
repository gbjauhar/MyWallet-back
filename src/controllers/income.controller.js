import { sessions, users, entries } from "../index.js";
import { entrySchema } from "../schemas/entrySchema.js"
import dayjs from "dayjs";

export async function postIncome(req, res) {
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


  if (user) {
    entries.insertOne({
      userId: user._id,
      cost,
      description,
      type: "income",
      time: dayjs(Date.now()).format("DD/MM")
    })
    res.sendStatus(201);
  } else {
    res.sendStatus(401);

  }
}