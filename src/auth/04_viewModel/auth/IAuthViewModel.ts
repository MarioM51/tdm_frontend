import type UserModel from '../../01_model/UserModel';
import type { Readable } from 'svelte/store';
import type { AuthPanel } from './AuthPanel';

export default interface IAuthViewModel {
  

  setPanel(authPanel:AuthPanel):void
  onSubmit():void
  logout(msg:string):void

  getSession():Readable<UserModel>
  getUserToLogin():Readable<UserModel>
  getUserToRegister():Readable<UserModel>
  getErrorMessage():Readable<string>
  getSuccessMessage(): Readable<string>
  getRequestUser():Readable<Promise<UserModel>>

  
}