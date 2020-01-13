import { UserService } from '../services';
import { Helpers } from '../utils';

const {
  successResponse, errorResponse, extractUserData
} = Helpers;

const { find, updateAny, deleteOne } = UserService;

/**
 * A collection of methods that controls user's interaction via the User routes
 *
 * @class UserController
 */
class UserController {
  /**
   * Gets a user profile after registeration or sign-in.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response with the user's profile details.
   * @memberof UserController
   */
  static async getUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await find({ id: userId });
      const userResponse = extractUserData(user);
      successResponse(res, userResponse, 200);
    } catch (error) {
      errorResponse(res, { code: error.statusCode, message: error.message });
    }
  }

  /**
   * Updates a user profile.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response with the new user's profile update.
   * @memberof UserController
   */
  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await updateAny(req.body, { id: userId });
      const userResponse = extractUserData(user);
      successResponse(res, userResponse, 200);
    } catch (error) {
      errorResponse(res, { code: error.statusCode, message: error.message });
    }
  }


  /**
   * Delete a user profile.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response
   * @memberof UserController
   */
  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const result = await deleteOne({ id: userId });
      if (result === 1) {
        return successResponse(res, 'Successfully deleted', 204);
      }
      errorResponse(res, { code: 404, message: 'User does not exists' });
    } catch (error) {
      errorResponse(res, { code: error.statusCode, message: error.message });
    }
  }
}

export default UserController;
