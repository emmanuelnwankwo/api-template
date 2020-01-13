import { isNullOrUndefined } from 'util';
import { AuthValidation } from '../validation';
import { Helpers } from '../utils';
import { UserService } from '../services';

const {
  errorResponse, verifyToken, getToken
} = Helpers;
const { validateLoginData, validateSignupData } = AuthValidation;

/**
 * Middleware for input validations
 */
export default class AuthMiddleware {
/**
     * Middleware method for user validation during signup/registration
     * @param {object} req - The request from the endpoint.
     * @param {object} res - The response returned by the method.
     * @param {object} next - the returned values going into the next operation.
     * @returns {object} - returns an object (error or response).
     */
  static async signupValidation(req, res, next) {
    try {
      const validated = await validateSignupData(req.body);
      if (validated) {
        const { email } = req.body;
        const emailExists = await UserService.find({ email });
        if (!emailExists) {
          return next();
        }
        errorResponse(res, { code: 409, message: `User with email: ${req.body.email} already exists` });
      }
    } catch (error) {
      let status = 500;
      if (error.details[0].context.label) { status = 400; }
      errorResponse(res, {
        code: status, message: error.details[0].context.label || error.message
      });
    }
  }

  /**
       * Middleware method for user validation during login
       * @param {object} req - The request from the endpoint.
       * @param {object} res - The response returned by the method.
       * @param {object} next - Call the next operation.
       * @returns {object} - Returns an object (error or response).
       */
  static async loginValidation(req, res, next) {
    try {
      const validated = await validateLoginData(req.body);
      if (validated) {
        next();
      }
    } catch (error) {
      errorResponse(res, { code: 400, message: error.details[0].context.label });
    }
  }

  /**
    * Middleware method for authentication
    * @param {object} req - The request from the endpoint.
    * @param {object} res - The response returned by the method.
    * @param {object} next - the returned values going into the next operation.
    * @returns {object} - next().
    */
  static authenticate(req, res, next) {
    try {
      const token = getToken(req);
      if (!token) return errorResponse(res, { code: 401, message: 'Access denied, Token required' });
      const { userId } = req.params;
      if (!isNullOrUndefined(userId)) {
        const decoded = verifyToken(token);
        const { id } = decoded;
        switch (Number(userId) === id) {
          case true:
            break;
          default:
            return errorResponse(res, { code: 401, message: 'Access denied, check Url' });
        }
      }
      req.data = verifyToken(token);
      next();
    } catch (err) {
      errorResponse(res, { code: 401, message: err.message });
    }
  }
}
