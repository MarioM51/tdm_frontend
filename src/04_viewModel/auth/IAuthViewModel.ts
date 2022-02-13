import type UserModel from 'src/01_model/auth/UserModel';
import type { Readable } from 'svelte/store';
import type { AuthPanel } from './AuthPanel';

export default interface IAuthViewModel {
  

  setPanel(authPanel:AuthPanel):void
  onSubmit():void
  logout():void

  getSession():Readable<UserModel>
  getUserToLogin():Readable<UserModel>
  getUserToRegister():Readable<UserModel>
  getErrorMessage():Readable<string>
  getSuccessMessage(): Readable<string>
  getRequestUser():Readable<Promise<UserModel>>

  
}