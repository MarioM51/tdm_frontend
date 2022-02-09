import RequestHelper, { HttpMethod } from "../RequestHelper"

import RolModel from "../../01_model/user/RolModel"
import UserModel from "../../01_model/user/UserModel"
import UserStoreDAO from "../auth/AuthStoreDAO"

export default class UserApiDAO {
  
  public static readonly API_BASE = "http://localhost:8081"
  public static API = this.API_BASE + "/users"

  private readonly userStore = new UserStoreDAO()

  public async getAll(): Promise<UserModel[]> {
    const request = new RequestHelper<UserModel[]>();
    request.url = UserApiDAO.API;
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
    request.url = UserApiDAO.API + "/" + toDel.id;
    request.cast = async (resp)=>{
      const resData = await resp.json()
      const userDeleted = UserModel.fromJson(resData);
      return userDeleted;
    }

    const userDeleted = request.doRequest()
    
    return userDeleted
  }

}
