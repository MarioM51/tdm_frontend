import type UserModel from "../../01_model/user/UserModel";

export default interface IAuthService {
  
  getUserStored(): UserModel;

  doLogin(user: UserModel):Promise<UserModel>;

  register(user: UserModel):Promise<UserModel>;

  cleanSession(): void;

  

}