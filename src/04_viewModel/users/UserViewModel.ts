
import type IUserViewModel from './IUserViewModel';
import type IUserService from '../../03_logic/users/IUserService';
import type IAuthViewModel from '../auth/IAuthViewModel';
import UserService from '../../03_logic/users/UserService';
import AuthViewModel from '../auth/AuthViewModel';
import type UserModel from '../../01_model/user/UserModel';
import ErrorModel from '../../01_model/error/ErrorModel';
import { get, Writable, writable } from 'svelte/store';
import type { Readable } from "svelte/store";
import type RolModel from '../../01_model/user/RolModel';

export default class UserViewModel implements IUserViewModel {

  //view utils
  private _userServ: IUserService = new UserService()
  private _authMV: IAuthViewModel = AuthViewModel.getInstance();

  //view components private
  private _usersTable:Writable<UserModel[]> = writable([]);
  private _requestUsers:Writable<Promise<UserModel[]>> = writable(null);

  private _userToEdit:Writable<UserModel> = writable(null);

  private _errorMessage:Writable<String> = writable(null);

  //view components public
  public allRols:Writable<RolModel[]> = writable([]);

  private static _instance : IUserViewModel= null;

  public static getInstance():IUserViewModel {
    if (UserViewModel._instance === null) {
      UserViewModel._instance = new UserViewModel();
    }
    return UserViewModel._instance;
  }

  public onInit():void {
      const allUsers = this._userServ.getAll();
      this._requestUsers.set(allUsers);
      this._errorMessage.set(null)
      allUsers
        .then((users)=> {
          this._usersTable.set(users);
          (async  () => {
            const allRolsFinded = await this._userServ.findAllRols()
            this.allRols.set(allRolsFinded);
          })();

          
        })
        .catch(err => {
          ErrorModel.handleRequestErrors(err, this._errorMessage, this._authMV)
        })
      ;
  }

  public onClickEdit(idUser:number): void {
    if(idUser == -1) {
      this._userToEdit.set(null);
      return
    }

    const userSelected = get(this._usersTable)[idUser];
    this._userToEdit.set(userSelected);
  }

  public onSubmitEdit(): void {
    this._usersTable.update(table => {
      
      table.forEach(user => {
        const finded = user.id == get(this._userToEdit).id;
        if(finded) {
          user = get(this._userToEdit)
        }
      })

      return table;
    })
  }

  public remove(idUser:number): void {
    
  }

  public switchRole(rol: RolModel): void {
    this._userToEdit.update(u => {
      if(u.rols.some(r => r.id == rol.id) ) {
        console.log("remove");
        const rolRemoved = u.rols.filter(r => r.id != rol.id)
        u.rols = rolRemoved;
      } else {
        console.log("add");
        u.rols.push(rol)
      }

      return u;
    })

    
  }

  public get usersTable():Readable<UserModel[]> { return this._usersTable }
  public get requestUsers():Readable<Promise<UserModel[]>> { return this._requestUsers }
  public get errorMsg():Readable<String> { return this._errorMessage; }
  public getUserToEdit(): Readable<UserModel> { return this._userToEdit; }
  
}