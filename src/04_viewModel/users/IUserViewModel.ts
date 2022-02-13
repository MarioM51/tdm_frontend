import type UserModel from "../../01_model/auth/UserModel";
import type { Readable } from "svelte/store";
import type RolModel from "../../01_model/auth/RolModel";


export default interface IUserViewModel {

  onInit():void

  onClickRemove(idUser:number):void
  onConfirmRemove():void

  onClickEdit(idUser:number):void
  onSubmitEdit(): void
  switchRole(rol:RolModel):void

  get usersTable():Readable<UserModel[]>
  get errorMsg():Readable<String>
  get requestUsers():Readable<Promise<UserModel[]>>
  get allRols():Readable<RolModel[]>
  getUserToEdit():Readable<UserModel>
  getUserRequestEdit(): Readable<Promise<UserModel>>

  getUserToDelete():Readable<UserModel>
  getUserRequestDelete():Readable<Promise<UserModel>>

}