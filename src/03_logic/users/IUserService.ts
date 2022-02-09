import type RolModel from "../../01_model/user/RolModel";
import type UserModel from "../../01_model/user/UserModel"

export default interface IUserService {

  getAll() : Promise<UserModel[]>

  doDelete(user: UserModel): Promise<UserModel>;

  findAllRols() : Promise<RolModel[]>

}