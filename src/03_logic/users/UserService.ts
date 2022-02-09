import type IUserService from "./IUserService";

import UserApiDAO from "./../../02_data/user/UserApiDAO";
import type UserModel from "../../01_model/user/UserModel";
import RolModel from "../../01_model/user/RolModel";

export default class UserService implements IUserService {

  private readonly userApi = new UserApiDAO()

  public getAll(): Promise<UserModel[]> {
    const users = this.userApi.getAll();
    return users;
  }

  public async doDelete(toDel: UserModel): Promise<UserModel> {
    const userDeleted:UserModel = await this.userApi.deleteUser(toDel);
    return userDeleted
  }

  public findAllRols(): Promise<RolModel[]> {
    let req = new Promise<RolModel[]>((resolve, reject) => {
      setTimeout(()=>{
        const allRols:RolModel[] = [
          new RolModel(1, "admin"),
          new RolModel(2, "product"),
          new RolModel(3, "blogs"),
        ]

        resolve(allRols);
      },100);

      setTimeout(()=>{ reject("Cataplum");}, 1200);
   });

   return req;
  }

}