import type RolModel from "src/01_model/auth/RolModel";
import type UserModel from "../../01_model/auth/UserModel";

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