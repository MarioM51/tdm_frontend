import UserModel from "../01_model/UserModel";

export default class AuthStoreDAO {

  private readonly LS_TOKEN = "token";
  private readonly LS_USER_INFO = "user_info";

  public get(): UserModel {
    const jsonStored: string = localStorage.getItem(this.LS_USER_INFO);
    if (jsonStored == null) {
      return null
    }
    const jsonObject = JSON.parse(jsonStored);
    const user = new UserModel();
    Object.assign(user, jsonObject)
    return user;
  }

  public saveToken(token: string): void {
    if (token == null) {
      localStorage.removeItem(this.LS_TOKEN)
    } else {
      localStorage.setItem(this.LS_TOKEN, token);
    }
  }

  public getToken(): string {
    return localStorage.getItem(this.LS_TOKEN);
  }

  public save(user: UserModel) {
    if (user == null) {
      localStorage.removeItem(this.LS_USER_INFO)
    } else {
      user.password = "";
      localStorage.setItem(this.LS_USER_INFO, JSON.stringify(user));
    }
  }


}