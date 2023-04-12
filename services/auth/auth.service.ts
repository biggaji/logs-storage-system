import client from "../../@commons/db";
import { ForbiddenError, NotFoundError, ValidationError } from "../../@commons/errors";
import { CreateAccountPayload, LoginAccess, LoginPayload } from "../../types/auths.interface";
import UserService from "../users/users.service";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const userService = new UserService;

/**
 * @author Tobi Ajibade
 * @class AuthService
 * @description Handles all authentication and authorization logic within the logs storage system.
 */
export default class AuthService {

  /**
   * @method signUp
   * @description Creates a record for a user and stores it in a database
   * @param object CreateAccountPayload
   * @returns {boolean}
   */
  async signUp(payload: CreateAccountPayload): Promise<boolean> {
    let accountCreated = false;
    const { email, first_name, last_name } = payload;
    let password = payload.password;
    try {
      // Validate data
      if (!email || !email.includes("@")) {
        throw new ValidationError("Enter a valid email address");
      }

      if (!first_name) {
        throw new ValidationError("Firstname is required");
      }

      if (!last_name) {
        throw new ValidationError("Lastname is required");
      }

      if (!password || password.length < 8) {
        throw new ValidationError("Please enter a valid password character, length must be 8 or more");
      }
  
      // user check
      const checkUserExist = await userService.checkUserExist(email.toLowerCase());

      if (checkUserExist) {
        throw new ForbiddenError("Admin already exist, try to login");
      }

      // At this point the user doesn't exist
      password = await hash(password, 10);

      // store user_data
      const newAdmin = await client.adminUser.create({
        data: {
          email: email.toLowerCase(),
          first_name: first_name,
          last_name: last_name,
          password: password,
        }
      });

      if (newAdmin.id) {
        accountCreated = true;
      }

      return accountCreated;
    } catch (error) {
      throw error;
    }
  }

    /**
   * @method signIn
   * @description Authenticates a user account
   * @param object
   * @returns {string} access_token
   */
  async signIn(payload: LoginPayload): Promise<LoginAccess> {
    let loginSuccess = false;
    const { email, password } = payload;
    
    try {
      
      if (!email || !password) {
        throw new ValidationError("Email and password are required to login");
      }
  
      const checkUserExist = await userService.checkUserExist(email.toLowerCase());
  
      if (!checkUserExist) {
        throw new ForbiddenError("Admin not found, create an account instead");
      }
  
      const admin = await userService.getUserInfoByEmail(email.toLowerCase());
  
      if (!admin || admin === null) {
        throw new NotFoundError("Admin data not found");
      }
  
      const isSamePassword =  await compare(password, admin.password);
  
      if (!isSamePassword) {
        throw new ValidationError("Invalid or incorrect credentials");
      }
  
      const accessToken = await jwt.sign({
        id: admin.id,
        email: admin.email,
        access_role: admin.access_role,
        account_status: admin.account_status
      }, process.env.JWT_SECRET!, {expiresIn: "1d"});

      loginSuccess = true;
  
      return {access_token: accessToken, success: loginSuccess };
    } catch (error) {
      throw error;
    }
  }
}