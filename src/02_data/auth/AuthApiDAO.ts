import UserModel from "../../01_model/auth/UserModel";
import RequestHelper, { HttpMethod } from "../RequestHelper";
import UserStoreDAO from "./AuthStoreDAO";

export default class AuthApiDAO {

  private readonly userStore = new UserStoreDAO()

  public static readonly API_BASE = "http://localhost:8081"
  public static API = this.API_BASE + "/users"

  async login(user: UserModel): Promise<UserModel> {
    const request = new RequestHelper<UserModel>();
    request.url = AuthApiDAO.API + "/login";
    request.method = HttpMethod.POST;
    request.data = user;
    request.cast = async (resp:Response)=>{
      const resData = await resp.json()
      const userInfo = UserModel.fromJson(resData);
      userInfo.password = resp.headers.get('Token');
      return userInfo;
    }
    
    const userInfo = request.doRequest()

    return userInfo
  }

  public async register(userToAdd: UserModel) : Promise<UserModel>{
    const request = new RequestHelper<UserModel>();
    request.method = HttpMethod.POST;
    request.data = userToAdd;
    request.url = AuthApiDAO.API;
    request.cast = async (resp)=>{
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
    request.token = this.userStore.getToken();
    request.cast = async (resp)=>{
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
    request.token = this.userStore.getToken();
    request.cast = this.castUser

    const userDeleted = request.doRequest()
    
    return userDeleted
  }

  public edit(userToEdit: UserModel): Promise<UserModel> {
    const request = new RequestHelper<UserModel>();
    request.method = HttpMethod.PUT;
    request.url = AuthApiDAO.API;
    request.data = userToEdit;
    request.cast = this.castUser
    request.token = this.userStore.getToken();

    const userEdited = request.doRequest();

    return userEdited;
  }

  private async castUser(resp:any):Promise<UserModel> {
    const resData = await resp.json()
      const userDeleted = UserModel.fromJson(resData);
      return userDeleted;
  }

}