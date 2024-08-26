import Joi from "joi";

const joi_validation = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Name should be a type of text",
    "string.empty": "Name is required",
    "string.min": "Name should have a minimum length of {#limit}",
    "string.max": "Name should have a maximum length of {#limit}",
    "any.required": "Name is required",
  }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org", "edu", "gov", "io", "co", "biz", "info", "me", "tv", "us", "uk", "ca", "de", "jp", "fr", "au", "in", "cn", "br", "ru", "za", "mx", "es", "nl", "se", "no", "fi", "dk", "ch", "it", "pl", "gr", "tr", "kr", "ar", "cl", "nz", "sg", "hk", "my", "th", "id", "vn", "ph", "sa", "ae", "il", "eg", "pk", "ng", "ke", "ug", "services"] } })
    .required()
    .messages({
      "string.base": "Email should be a type of text",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    batch: Joi.number().integer().min(1).max(50).required().messages({
        "number.base": "Batch should be a valid integer.",
        "number.empty": "Batch is required.",
        "number.min": "Batch should be at least 1.",
        "number.max": "Batch should not exceed 50.",
        "any.required": "Batch is required.",
        "number.positive": "Batch should be a positive number."
      }),
    
      division: Joi.number().integer().min(1).max(12).required().messages({
        "number.base": "Division should be a valid integer.",
        "number.min": "Division should be at least 1.",
        "number.max": "Division should not exceed 12.",
        "any.required": "Division is required.",
        "number.positive": "Division should be a positive number."
      })
});

export default joi_validation;
