import Joi from '@hapi/joi';

/**
   * This class holds all methods used for user validation
   * Functions:
   * 1) signup - validates user upon registration.
   * 2) dummy - a dummy method for testing validations upon success.
   */
export default class AuthValidation {
/**
     * Validates user paramenters upon registration
     *
     * @param {object} userObject - The user object
     * @param {object} res - The user response object
     * @returns {object} - returns an object (error or response).
     */
  static async validateSignupData(userObject) {
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(25).required()
        .label('Please enter a valid firstname \n the field must not be empty and it must be more than 2 letters'),
      lastName: Joi.string().min(3).max(25).required()
        .label('Please enter a valid lastname \n the field must not be empty and it must be more than 2 letters'),
      email: Joi.string().email().required()
        .label('Please enter a valid email address'),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        .label('Password is required. \n It should be more than 8 characters, and should include at least a capital letter, and a number'),
      gender: Joi.string().valid('Male', 'Female', 'male', 'female')
        .label("please input a gender 'male or female'"),
    });
      // Once user inputs are validated, move into server
    const { error } = schema.validate({ ...userObject });
    if (error) {
      throw error;
    }
    return true;
  }

  /**
     * Validates user paramenters upon login
     *
     * @param {object} userObject - The user object
     * @param {object} res - The user response object
     * @returns {object} - returns an object (error or response).
     */
  static async validateLoginData(userObject) {
    const schema = Joi.object({
      email: Joi.string().email().required()
        .label('Please enter a valid email address'),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        .label('Password is not provided or its invalid'),
    });
    // Once user inputs are validated, move into server
    const { error } = schema.validate({ ...userObject });
    if (error) {
      throw error;
    }
    return true;
  }
}
