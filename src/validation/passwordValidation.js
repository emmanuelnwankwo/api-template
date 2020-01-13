import Joi from '@hapi/joi';

export const passwordResetEmailSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
});

export const changePasswordSchema = Joi.object({
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    // .label('Password does not match')
});
