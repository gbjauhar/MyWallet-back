import { signUpSchema } from "../schemas/signUpSchema.js";

export async function validateSignUp(req, res, next){
  const user = req.body

const { error } = signUpSchema.validate(user, { abortEarly: false });
if (error) {
  const errors = error.details.map((detail) => detail.message);
  res.send(errors);
  return;
}
next()
}