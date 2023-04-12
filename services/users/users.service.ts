import client from "../../@commons/db";
import { AdminUserData } from "../../types/users.interface";

export default class UserService {
  async checkUserExist(email: string): Promise<boolean> {
    let exist = false;
    const user = await client.adminUser.findUnique({
      where: {
        email: email
      }
    });

    if (user) {
      exist = true;
    }

    return exist;
  }

  async getUserInfoByEmail(email: string): Promise<AdminUserData|null> {
    const user = await client.adminUser.findUnique({
      where: {
        email: email
      }
    });

    if (user != null) {
      return user;
    }

    return null;
  }
}