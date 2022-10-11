import RequestHelper, { HttpMethod } from "../../helpers/RequestHelper";
import UserModel from "../01_model/UserModel";
import AuthStoreDAO from "./AuthStoreDAO";

export default class AuthApiDAO {

  private readonly _authStore = new AuthStoreDAO()

  private static API = "/users"

  async login(user: UserModel): Promise<UserModel> {
    const request = new RequestHelper<UserModel>();
    request.url = AuthApiDAO.API + "/login";
    request.method = HttpMethod.POST;
    request.data = user;
    request.cast = async (resp: Response) => {
      const resData = await resp.json()
      const userInfo = UserModel.fromJson(resData);
      userInfo.password = resp.headers.get('Token');
      return userInfo;
    }

    const userInfo = request.doRequest()

    return userInfo
  }

  public async register(userToAdd: UserModel): Promise<UserModel> {
    const request = new RequestHelper<UserModel>();
    request.method = HttpMethod.POST;
    userToAdd.ensureData()
    request.data = userToAdd;
    request.url = AuthApiDAO.API;
    request.cast = async (resp) => {
      const resData = await resp.json()
      const userAdded = UserModel.fromJson(resData);
      return userAdded;
    }

    const userAdded = request.doRequest()

    return userAdded
  }

  public async getAll(): Promise<UserModel[]> {
    const request = new RequestHelper<UserModel[]>();
    request.url = AuthApiDAO.API;
    request.method = HttpMethod.GET;
    request.token = this._authStore.getToken();
    request.cast = async (resp) => {
      const resData = await resp.json()
      const users = UserModel.fromArrayJson(resData);
      return users
    }

    const users = request.doRequest();

    return users
  }

  public async deleteUser(toDel: UserModel): Promise<UserModel> {
    const request = new RequestHelper<UserModel>();
    request.method = HttpMethod.DELETE;
    request.url = AuthApiDAO.API + "/" + toDel.id;
    request.token = this._authStore.getToken();
    request.cast = this.castUser

    const userDeleted = request.doRequest()

    return userDeleted
  }

  public edit(userToEdit: UserModel): Promise<UserModel> {
    const request = new RequestHelper<UserModel>();
    request.method = HttpMethod.PUT;
    request.url = AuthApiDAO.API;
    userToEdit.ensureData()
    request.data = userToEdit;
    request.cast = this.castUser
    request.token = this._authStore.getToken();

    const userEdited = request.doRequest();

    return userEdited;
  }

  public async fetchUserDetails(idUser: number): Promise<UserModel> {
    const request = new RequestHelper<UserModel>();
    request.method = HttpMethod.GET;
    request.url = AuthApiDAO.API + "/" + idUser;
    request.cast = this.castUser
    request.token = this._authStore.getToken();

    const userDetails = await request.doRequest();

    return userDetails;
  }

  private async castUser(resp: any): Promise<UserModel> {
    const resData = await resp.json()
    const userDeleted = UserModel.fromJson(resData);
    return userDeleted;
  }

}