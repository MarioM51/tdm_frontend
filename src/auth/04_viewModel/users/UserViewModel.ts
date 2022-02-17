
import type IUserViewModel from './IUserViewModel';
import type IAuthViewModel from '../auth/IAuthViewModel';
import AuthViewModel from '../auth/AuthViewModel';
import { get, writable } from 'svelte/store';
import type { Writable } from "svelte/store";
import type { Readable } from "svelte/store";
import type RolModel from '../../01_model/RolModel';
import AuthService from '../../03_logic/AuthService';
import type IAuthService from '../../03_logic/IAuthService';
import type UserModel from '../../01_model/UserModel';
import ErrorModel from '../../../error/ErrorModel';

export default class UserViewModel implements IUserViewModel {

  //view utils
  private _authMV: IAuthViewModel = AuthViewModel.getInstance();
  private _authServ: IAuthService = new AuthService();

  //view components private
  private _usersTable:Writable<UserModel[]> = writable([]);
  private _requestUsers:Writable<Promise<UserModel[]>> = writable(null);

  private _userToEdit:Writable<UserModel> = writable(null);
  private _userRequestEdit:Writable<Promise<UserModel>> = writable(null);

  private _userToDelete:Writable<UserModel> = writable(null);
  private _userRequestDelete:Writable<Promise<UserModel>> = writable(null);

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
      const allUsers = this._authServ.getAll();
      this._requestUsers.set(allUsers);
      this._errorMessage.set(null)
      allUsers
        .then((users)=> {
          this._usersTable.set(users);
          this. loadingsAfterMainLoad()
        })
        .catch(err => {
          ErrorModel.handleRequestErrors(err, this._errorMessage, this._authMV)
        })
      ;
  }

  private async loadingsAfterMainLoad() {
    const allRolsFinded = await this._authServ.findAllRols()
    this.allRols.set(allRolsFinded);
  }

  public onClickEdit(userRow:number): void {
    if(userRow == -1) {
      this._userToEdit.set(null);
      return
    }

    const userSelected = get(this._usersTable)[userRow];
    this._userToEdit.set(userSelected);
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
    });
  }

  public onSubmitEdit(): void {
    //Send edit request
    const editRequest = this._authServ.edit(get(this._userToEdit));
    this._userRequestEdit.set(editRequest);

    //react to request response
    editRequest
      .then(_ => {
        //add user's changes to users table
        this._usersTable.update(table => {
          table.forEach(user => {
            const finded = user.id == get(this._userToEdit).id;
            if(finded) {
              user = get(this._userToEdit)
            }
          })
          return table;
        });

        this._userToEdit.set(null)//to close modal
        this._userRequestEdit.set(null);//clear memory
      })
      .catch((error) => {
        ErrorModel.handleRequestErrors(error, this._errorMessage, this._authMV)
      })
    ;
  }

  public onClickRemove(userRow:number): void {
    if (userRow < 0) {
      this._userToDelete.set(null)
      return
    }

    const userSelected = get(this._usersTable)[userRow];
    this._userToDelete.set(userSelected)
  }

  public onConfirmRemove(): void {
    //send delete request to logic
    const delReq = this._authServ.doDelete(get(this._userToDelete));
    this._userRequestDelete.set(delReq);
    delReq.then(_ => {
      this._usersTable.update(table => {
        //delete user in the table users UI
        return table.filter(u => u.id != get(this._userToDelete).id);
      });

      this._userToDelete.set(null);
      this._userRequestDelete.set(null);
    }).catch(err => {
      ErrorModel.handleRequestErrors(err, this._errorMessage, this._authMV)
    })
  }

  public get usersTable():Readable<UserModel[]> { return this._usersTable }
  public get requestUsers():Readable<Promise<UserModel[]>> { return this._requestUsers }
  public get errorMsg():Readable<String> { return this._errorMessage; }
  public getUserToEdit(): Readable<UserModel> { return this._userToEdit; }
  public getUserRequestEdit(): Readable<Promise<UserModel>> { return this._userRequestEdit; }
  public getUserToDelete(): Readable<UserModel> { return this._userToDelete }
  public getUserRequestDelete(): Readable<Promise<UserModel>> { return this._userRequestDelete }
  
}