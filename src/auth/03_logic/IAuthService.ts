import type RolModel from "../01_model/RolModel";
import type UserModel from "../01_model/UserModel";

export default interface IAuthService {
  
  getUserStored(): UserModel;

  doLogin(user: UserModel):Promise<UserModel>;

  register(user: UserModel):Promise<UserModel>;

  cleanSession(): void;

  getAll(): Promise<UserModel[]>

  doDelete(toDel: UserModel): Promise<UserModel>

  findAllRols(): Promise<RolModel[]>

  edit(userToEdit: UserModel) : Promise<UserModel>

}