import joi from "joi"

export const entrySchema = joi.object({
    cost: joi.number().required(),
    description: joi.string().required(),
  });