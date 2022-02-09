import RolModel from "./RolModel";

export default class UserModel {
  constructor(
    public id:number = null,
    public email:string = "",
    public password:string = null,
    public confirmPass:string = null,
    public rols:RolModel[]= null
  ) {}

  public validate():string {
    if (this.email == null || this.email == "") {
      return "Email required";
    }

    if (this.password == null || this.password == "") {
      return "Password required";
    }

    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.email.match(regexEmail)) {
      return "Bad format email";
    }

    return "";
  }

  public isMatchPasswords():string {
    if (this.confirmPass == null || this.confirmPass == "") {
      return "Confirm password required";
    }
    if (this.password != this.confirmPass) {
      return "Paswords don't match";
    }
    
    return ""
  }

  public static fromJson(rawUser: any): UserModel {
    const rols = rawUser.Roles?.map((rawRol: any) => RolModel.fromJson(rawRol) )

    const user = new UserModel();
    user.id = rawUser.ID
    user.email = rawUser.email
    user.password = rawUser.password
    user.rols = rols
    
    return user
  }

  public static fromArrayJson(rawUsers: any): UserModel[] {
    const users = rawUsers.map((rawUser: any) => UserModel.fromJson(rawUser) )
    return users
  }


}
