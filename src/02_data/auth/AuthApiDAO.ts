import UserModel from "../../01_model/user/UserModel";
import RequestHelper, { HttpMethod } from "../RequestHelper";
import UserApiDAO from "../user/UserApiDAO";

export default class AuthApiDAO {

  async getToken(user: UserModel): Promise<string> {
    const request = new RequestHelper<string>();
    request.url = UserApiDAO.API + "/login";
    request.method = HttpMethod.POST;
    request.data = user;
    request.cast = async (resp)=>{
      const respData = await resp.json();
      return respData.token
    }
    
    const token = request.doRequest()

    return token
  }

  public async register(userToAdd: UserModel) : Promise<UserModel>{
    const request = new RequestHelper<UserModel>();
    request.method = HttpMethod.POST;
    request.data = userToAdd;
    request.url = UserApiDAO.API;
    request.cast = async (resp)=>{
      const resData = await resp.json()
      const userAdded = UserModel.fromJson(resData);
      return userAdded;
    }

    const userAdded = request.doRequest()
    
    return userAdded
  }

}