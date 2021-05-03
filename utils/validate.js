'use strict';
import Joi from 'joi';

const username = Joi
.string()
.alphanum()
.min(4)
.max(20)
.required();

const password = Joi.string()
.min(5)
.max(20)
.required();

const email = Joi.string()
.required()
.email()


const Registerschema = Joi.object({
  username,
  password,
  confirmPassword: Joi
            .any()
            .valid(Joi.ref('password'))
            .required()
            .messages({
              'any.only': `"confirmPassword" must be the same`,
            })
            ,
  email
});

const Loginschema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const title = Joi.string()
.max(50)
.required()

const description = Joi.string()
.max(80)
.required()

const hidden =  Joi.boolean()
.required()

const Postschema = Joi.object({
  title: title,

  body: Joi.string()
            .max(1000)
            .required(),

  description: description,

  hidden:  hidden,
});

const UpdateUserSchema = Joi.object({
    username,
    email,
    bio: Joi.string()
        .max(100),
    public_id: Joi.string()
        .required(),
    url: Joi.string()
        .required()

});

const UpdatePostSchema = Joi.object({
  title: title,
  description: description,
  hidden:  hidden,

});


export {
  Loginschema,
  Registerschema,
  Postschema,
  UpdateUserSchema,
  UpdatePostSchema
};
