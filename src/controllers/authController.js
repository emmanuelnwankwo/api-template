import {
  UserService,
} from '../services';
import {
  Helpers, Mailer, ApiError
} from '../utils';


const {
  generateToken, verifyToken, successResponse, errorResponse, extractUserData,
  comparePassword, hashPassword, generateVerificationLink
} = Helpers;
const { sendMail } = Mailer;

const {
  create, updateById, updatePassword, find,
} = UserService;


/**
   * A collection of methods that controls authentication responses.
   *
   * @class AuthController
   */
export default class AuthController {
  /**
     * Registers a new user.
     *
     * @static
     * @param {Request} req - The request from the endpoint.
     * @param {Response} res - The response returned by the method.
     * @returns { JSON } A JSON response with the registered user's details and a JWT.
     * @memberof Auth
     */
  static async createUser(req, res) {
    try {
      const { body } = req;
      let user = await create({ ...body });
      user.token = generateToken({ email: user.email, id: user.id });
      user = extractUserData(user);
      const { email, firstName, token } = user;
      const verificationLink = generateVerificationLink(req, {
        id: user.id, email
      });
      const isSent = await sendMail({
        email, templateId: 'd-e072524f25744ea3a65cfb1baa794094', firstName, verificationLink
      });
      res.cookie('token', token, { maxAge: 86400000, httpOnly: true });
      return successResponse(res, { ...user, emailSent: isSent }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
     *
     *  verifies user's email address
     * @static
     * @param {Request} req - The request from the endpoint.
     * @param {Response} res - The response returned by the method.
     * @returns { JSON } - A JSON object containing success or failure details.
     * @memberof Auth
     */
  static async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      const decoded = verifyToken(token);
      const user = await updateById({ isVerified: true }, decoded.id);
      const userResponse = extractUserData(user);
      successResponse(res, { ...userResponse });
    } catch (e) {
      if (e.message === 'Invalid Token') {
        return errorResponse(res, { code: 400, message: 'Invalid token, verification unsuccessful' });
      }

      if (e.message === 'Not Found') {
        return errorResponse(res, { code: 400, message: 'No user found to verify' });
      }
      errorResponse(res, {});
    }
  }

  /**
     * Sends a user reset password link
     *
     * @param {Request} req - The request from the endpoint.
     * @param {Response} res - The response returned by the method.
     * @returns {JSON} A JSON response with a successfully message.
     * @memberof Auth
     */
  static async sendResetPasswordEmail(req, res) {
    try {
      const { email } = req.body;
      const user = await find({ email });
      if (!user) {
        throw new ApiError(404, 'User account does not exist');
      }
      const { firstName, id } = user;
      const token = generateToken({ id, email }, '24h');
      const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${token}`;
      const response = await sendMail({
        email, templateId: 'd-a4f399a537ee49598ca1ebd4a19f527e', firstName, urlLink: resetUrl
      });
      if (response) return successResponse(res, 'Password reset link sent successfully', 200);
    } catch (err) {
      const status = err.status || 500;
      errorResponse(res, { code: status, message: err.message });
    }
  }

  /**
     * Gets user new password object from the request and saves it in the database
     *
     * @param {Request} req - The request from the endpoint.
     * @param {Response} res - The response returned by the method.
     * @returns {JSON} A JSON response with the registered user and a JWT.
     * @memberof Auth
     */
  static async resetPassword(req, res) {
    try {
      const { password } = req.body;
      const { email } = req.params;
      const [updatedPassword] = await updatePassword(password, email);
      if (updatedPassword === 1) {
        successResponse(res, 'Password has been changed successfully', 200);
      } else {
        throw new ApiError(404, 'User account does not exist');
      }
    } catch (err) {
      const status = err.status || 500;
      errorResponse(res, { code: status, message: err.message });
    }
  }

  /**
     * Verify password reset link token
     *
     * @param {Request} req - The request from the endpoint.
     * @param {Response} res - The response returned by the method.
     * @returns {JSON} A JSON response with password reset link.
     * @memberof Auth
     */
  static verifyPasswordResetLink(req, res) {
    try {
      const { token } = req.query;
      const { email } = verifyToken(token);
      const url = `${req.protocol}://${req.get('host')}/api/auth/password/reset/${email}`;
      successResponse(res, `Goto ${url} using POST Method with body 'password': 'newpassword' and 'confirmPassword': 'newpassword'`, 200);
    } catch (err) {
      const status = err.status || 500;
      errorResponse(res, { code: status, message: `Verification unsuccessful, ${err.message}` });
    }
  }

  /**
    *  Login an existing user
    *
    * @param {object} req request object
    * @param {object} res reponse object
    * @returns {object} JSON response
    */
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await find({ email });
      if (!user) {
        return errorResponse(res, { code: 401, message: 'User does not exists' });
      }
      if (!comparePassword(password, user.password)) {
        return errorResponse(res, { code: 401, message: 'Password is not correct, try again' });
      }
      user.token = generateToken({ email: user.email, id: user.id });
      const loginResponse = extractUserData(user);
      const { token } = loginResponse;
      res.cookie('token', token, { maxAge: 86400000, httpOnly: true });
      successResponse(res, { ...loginResponse });
    } catch (error) {
      errorResponse(res, {});
    }
  }

  /**
     *  successfully logout a user
     * @static
     * @param {Request} req - The request from the endpoint.
     * @param {Response} res - The response returned by the method.
     * @returns { JSON } - A JSON object containing success or failure details.
     * @memberof Auth
     */
  static logout(req, res) {
    try {
      res.clearCookie('token', { httpOnly: true });
      return successResponse(res, { code: 200, message: 'You have been successfully logged out' });
    } catch (error) {
      errorResponse(res, { message: error.message });
    }
  }
}
