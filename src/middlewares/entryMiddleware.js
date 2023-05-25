import { entrySchema } from "../schemas/entrySchema.js";

export async function validateEntry(req, res, next) {
  const { error } = entrySchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    res.send(errors);
    return;
  }
  next();
}
