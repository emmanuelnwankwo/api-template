import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import bcrypt from 'bcryptjs';
import env from '../config/envConfig';
// import ApiError from './apiError';

const { SECRET, PORT } = env;

/**
 *Contains Helper methods
 *
 * @class Helpers
 */
class Helpers {
  /**
 *  Synchronously sign the given payload into a JSON Web Token string.
 * @static
 * @param {string | number | Buffer | object} payLoad Payload to sign.
 * @param {string | number} expiresIn Expressed in seconds or a string describing a
 * time span. Eg: 60, "2 days", "10h", "7d". Default specified is 1day.
 * @memberof Helpers
 * @returns {string} JWT token.
 */
  static generateToken(payLoad, expiresIn = '1d') {
    return jwt.sign(payLoad, SECRET, { expiresIn });
  }

  /**
 *  Synchronously sign the given payload into a JSON Web Token string that never expires.
 * @static
 * @param {string | number | Buffer | object} payLoad Payload to sign.
 * @memberof Helpers
 * @returns {string} JWT token.
 */
  static generateTokenAlive(payLoad) {
    return jwt.sign(payLoad, SECRET);
  }

  /**
   *
   *  Synchronously verify the given JWT token using a secret
   * @static
   * @param {*} token - JWT token.
   * @returns {string | number | Buffer | object } - Decoded JWT payload if
   * token is valid or an error message if otherwise.
   * @memberof Helpers
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch (err) {
      throw new Error('Invalid Token');
    }
  }

  /**
   * Generates email verification link
   * @static
   * @param { Request } req - Request object
   * @param { object } options - Contains user's data to be signed within Token.
   * @param { string } options.id - User's unique ID.
   * @param { string } options.email - User's email.
   * @param { string } options.role - User's role.
   * @memberof Helpers
   * @returns {URL} - Verification link.
   */
  static generateVerificationLink(req, { id, email }) {
    const token = Helpers.generateToken({ id, email });
    const host = req.hostname === 'localhost' ? `${req.hostname}:${PORT}` : req.hostname;
    return `${req.protocol}://${host}/api/auth/verify?token=${token}`;
  }

  /**
 * Hashes a password
 * @static
 * @param {string} password - Password to encrypt.
 * @memberof Helpers
 * @returns {string} - Encrypted password.
 */
  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  /**
 * Compares a password with a given hash
 * @static
 * @param {string} password - Plain text password.
 * @param {string} hash - Encrypted password.
 * @memberof Helpers
 * @returns {boolean} - returns true if there is a match and false otherwise.
 */
  static comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  /**
 * Generates a JSON response for success scenarios.
 * @static
 * @param {Response} res - Response object.
 * @param {object} data - The payload.
 * @param {number} code -  HTTP Status code.
 * @memberof Helpers
 * @returns {JSON} - A JSON success response.
 */
  static successResponse(res, data, code = 200) {
    return res.status(code).json({
      status: 'success',
      data
    });
  }

  /**
 * Generates a JSON response for failure scenarios.
 * @static
 * @param {Response} res - Response object.
 * @param {object} options - The payload.
 * @param {number} options.code -  HTTP Status code, default is 500.
 * @param {string} options.message -  Error message.
 * @param {object|array  } options.errors -  A collection of  error message.
 * @memberof Helpers
 * @returns {JSON} - A JSON failure response.
 */
  static errorResponse(res, { code = 500, message = 'Some error occurred while processing your Request', errors }) {
    return res.status(code).json({
      status: 'fail',
      error: {
        message,
        errors
      }
    });
  }

  /**
 * Extracts a new user object from the one supplied
 * @static
 * @param {object} user - The user data from which a new user object will be extracted.
 * @memberof Helpers
 * @returns { object } - The new extracted user object.
 */
  static extractUserData(user) {
    return {
      id: user.id,
      token: user.token,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
 * Validates a value using the given Joi schema
 * @param {object} value
 * @param {Joi.SchemaLike} schema
 * @returns {Promise} Validation result
 */
  static validate(value, schema) {
    return schema.validate(value, { abortEarly: false, allowUnknown: true });
  }

  /**
 * Get token from request header for user authentication
 * @param {object} req - The request from the endpoint
 * @memberof Helpers
 * @returns {Token} Token
 */
  static getToken(req) {
    const {
      headers: { authorization },
      cookies: { token: cookieToken }
    } = req;
    let bearerToken = null;
    if (authorization) {
      bearerToken = authorization.split(' ')[1]
        ? authorization.split(' ')[1] : authorization;
    }
    return cookieToken || bearerToken || req.headers['x-access-token'] || req.headers.token || req.body.token;
  }

  /**
 * Extracts Array Records from sequelize object.
 * @static
 * @param {array} dataArray - An array of unformatted records.
 * @memberof Helpers
 * @returns { array } - An array containing formatted records.
 */
  static extractArrayRecords(dataArray) {
    return dataArray.map(({ dataValues }) => dataValues);
  }

  /**
   * Adds new properties to the items of a collection.
   * @static
   * @param {array} collection - An array of objects.
   * @param {object} options - An object with properties to be added to the items of a collection.
   * @returns {Promise<Array>} A promise object with an updated collection.
   * @memberof Helpers
   */
  static async updateCollection(collection, options) {
    return collection.map((item) => {
      const newItem = { ...item, ...options };
      return newItem;
    });
  }
}

export default Helpers;
