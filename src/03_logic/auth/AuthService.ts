import UserApiDAO from "../../02_data/user/UserApiDAO";
import type UserModel from "../../01_model/user/UserModel";
import AuthStoreDAO from "../../02_data/auth/AuthStoreDAO";
import AuthApiDAO from "../../02_data/auth/AuthApiDAO";
import type IAuthService from "./IAuthService";

export default class AuthService implements IAuthService {

  private readonly authApi = new AuthApiDAO()
  private readonly userStore = new AuthStoreDAO()

  public getUserStored(): UserModel {
    return this.userStore.get()
  }

  public async doLogin(user: UserModel): Promise<UserModel> {
    const token = await this.authApi.getToken(user);
    this.setSession(user, token)
    return user
  }

  public register(user: UserModel): Promise<UserModel> {
    const userAdded = this.authApi.register(user)
    return userAdded;
  }

  public cleanSession(): void {
    this.setSession(null, null)
  }

  private setSession(user:UserModel, token:string):void {
    this.userStore.save(user)
    this.userStore.saveToken(token)
  }

  public async doRegister(user: UserModel): Promise<UserModel> {
    const userAdded = await this.authApi.register(user);
    return userAdded
  }

}