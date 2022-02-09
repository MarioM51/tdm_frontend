import type UserModel from "../../01_model/user/UserModel";
import type { Readable } from "svelte/store";
import type RolModel from "../../01_model/user/RolModel";


export default interface IUserViewModel {

  onInit():void

  remove(idUser:number):void

  onClickEdit(idUser:number):void
  onSubmitEdit(): void
  switchRole(rol:RolModel):void

  get usersTable():Readable<UserModel[]>
  get errorMsg():Readable<String>
  get requestUsers():Readable<Promise<UserModel[]>>
  get allRols():Readable<RolModel[]>
  getUserToEdit():Readable<UserModel>

}