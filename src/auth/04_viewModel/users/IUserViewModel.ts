import type UserModel from "../../../auth/01_model/UserModel";
import type { Readable } from "svelte/store";
import type RolModel from "../../01_model/RolModel";


export default interface IUserViewModel {

  onInit(): void

  onClickRemove(idUser: number): void
  onConfirmRemove(): void

  onClickEdit(idUser: number): void
  onSubmitEdit(): void
  switchRole(rol: RolModel): void

  fetchUserDetails(idUser: number): void
  editUserDetails(): void;

  get usersTable(): Readable<UserModel[]>
  get errorMsg(): Readable<String>
  get requestUsers(): Readable<Promise<UserModel[]>>
  get allRols(): Readable<RolModel[]>
  getUserToEdit(): Readable<UserModel>
  getUserRequestEdit(): Readable<Promise<UserModel>>

  getUserToDelete(): Readable<UserModel>
  getUserRequestDelete(): Readable<Promise<UserModel>>

  getUserDetails(): Readable<UserModel>
  getUserDetailsRequest(): Readable<Promise<UserModel>>

}