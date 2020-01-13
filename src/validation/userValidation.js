/* eslint-disable no-useless-escape */
import Joi from '@hapi/joi';

/**
 * A collection of validation methods that checks data
 * entries for User Profile as an entity on the App.
 *
 * @class ProfileValidator
 */
export default class ProfileValidator {
  /**
     * Validates a Facility upon creation
     *
     * @param {object} user - The user profile object to be validated.
     * @returns {object | boolean } - returns an object (error response)
     * or a boolean if the user profile details are valid.
     */
  static async validateProfile(user) {
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(25)
        .label('Please enter a valid firstname \n the field must be more than 2 letters'),
      lastName: Joi.string().min(3).max(25)
        .label('Please enter a valid lastname \n the field must be more than 2 letters'),
      email: Joi.string().email()
        .label('Please enter a valid email address'),
      gender: Joi.string().valid('Male', 'Female', 'male', 'female')
        .label('Please enter a valid gender \n Male, Female')
    });
    const { error } = schema.validate({ ...user });
    if (error) {
      throw error;
    }
    return true;
  }
}
