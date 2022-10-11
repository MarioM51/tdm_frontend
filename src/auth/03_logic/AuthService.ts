import AuthApiDAO from "../02_data/AuthApiDAO";
import type IAuthService from "./IAuthService";
import RolModel from "../01_model/RolModel"
import AuthStoreDAO from "../02_data/AuthStoreDAO";
import type UserModel from "../01_model/UserModel";

export default class AuthService implements IAuthService {

  private readonly authApi = new AuthApiDAO()
  private readonly userStore = new AuthStoreDAO()

  public getUserStored(): UserModel {
    return this.userStore.get()
  }

  public async doLogin(user: UserModel): Promise<UserModel> {
    const userLogged = await this.authApi.login(user);
    // se usa el campo password aqui para retornar el token, para evitar mas trabajo
    this.setSession(userLogged, userLogged.password);
    userLogged.password = "";
    return userLogged
  }

  public register(user: UserModel): Promise<UserModel> {
    const userAdded = this.authApi.register(user)
    return userAdded;
  }

  public cleanSession(): void {
    this.setSession(null, null)
  }

  private setSession(user: UserModel, token: string): void {
    this.userStore.save(user)
    this.userStore.saveToken(token)
  }

  public async doRegister(user: UserModel): Promise<UserModel> {
    const userAdded = await this.authApi.register(user);
    return userAdded
  }

  public getAll(): Promise<UserModel[]> {
    const users = this.authApi.getAll();
    return users;
  }

  public async doDelete(toDel: UserModel): Promise<UserModel> {
    const userDeleted: UserModel = await this.authApi.deleteUser(toDel);
    return userDeleted
  }

  public findAllRols(): Promise<RolModel[]> {
    let req = new Promise<RolModel[]>((resolve, reject) => {
      setTimeout(() => {
        const allRols: RolModel[] = [
          new RolModel(79, "admin"),
          new RolModel(80, "blogs"),
          new RolModel(81, "products"),
        ]

        resolve(allRols);
      }, 100);

      setTimeout(() => { reject("Cataplum"); }, 1200);
    });

    return req;
  }

  public edit(userToEdit: UserModel): Promise<UserModel> {
    userToEdit.validate();

    //here should not edit the password, only the user can change his own password
    userToEdit.password = "";
    userToEdit.confirmPass = "";

    const requestEdit: Promise<UserModel> = this.authApi.edit(userToEdit);

    return requestEdit
  }

  public async fetchUserDetails(idUser: number): Promise<UserModel> {
    const userDetails: UserModel = await this.authApi.fetchUserDetails(idUser);
    return userDetails
  }

}