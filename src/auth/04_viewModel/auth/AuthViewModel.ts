import type { Writable, Readable } from 'svelte/store';
import { writable , get} from 'svelte/store';
import { replace, push } from 'svelte-spa-router'

import type IAuthViewModel from './IAuthViewModel';
import { AuthPanel } from './AuthPanel';

import AuthService from '../../03_logic/AuthService';
import UserModel from '../../01_model/UserModel';
import type IAuthService from '../../03_logic/IAuthService';
import ErrorModel from '../../../error/ErrorModel';


export default class AuthViewModel implements IAuthViewModel {
  
  private static instance:AuthViewModel

  //view utils
  private readonly authService:IAuthService = new AuthService();

  //view info
  private readonly session:Writable<UserModel> = writable(null);
  private readonly userToLogin:Writable<UserModel> = writable(null);
  private readonly userToRegister:Writable<UserModel> = writable(null);
  private readonly errorMessage:Writable<string> = writable("");
  private readonly successMessage:Writable<string> = writable("");

  private readonly requestUser:Writable<Promise<UserModel>> = writable(null);

  private constructor(){
    this.session.set(this.authService.getUserStored())
  }

  public static getInstance():IAuthViewModel {
    if(AuthViewModel.instance == null) {
      AuthViewModel.instance = new AuthViewModel();
    }
    return AuthViewModel.instance;
  }

  public setPanel(authPanel: AuthPanel): void {
    this.errorMessage.set("")
    if(authPanel == AuthPanel.LOGIN) {
      this.userToLogin.set(new UserModel())
      this.userToRegister.set(null)
    } else {
      this.userToLogin.set(null)
      this.userToRegister.set(new UserModel())
    }
  }

  public onSubmit():void {
    if(get(this.userToLogin) != null) {
      this.onLogin()
    } else if(get(this.userToRegister) != null) {
      this.onRegister();
      
    }
  }

  private onLogin():void {
    // validate user data
    let errorValidation = get(this.userToLogin).validate();
    this.errorMessage.set(errorValidation);
    if(errorValidation != "") {
      return ;
    }

    // validate password
    errorValidation = get(this.userToLogin).validatePassword();
    this.errorMessage.set(errorValidation);
    if(errorValidation != "") {
      return ;
    }

    //login request
    const loginRequest = this.authService.doLogin(get(this.userToLogin));
    this.requestUser.set(loginRequest);
    loginRequest
      .then(usr => {
        this.session.set(usr)
        replace('/')
      })
      .catch(err => {
        if(err instanceof ErrorModel) {
          this.errorMessage.set(err.cause)
        } else {
          this.errorMessage.set("Error: intente mas tarde o informe error")
        }
      })
  }

  private onRegister():void {
    //validate user data
    let errorValidation = get(this.userToRegister).validate();
    if(errorValidation != "") {
      this.errorMessage.set(errorValidation);
      return
    }

    // validate password
    errorValidation = get(this.userToRegister).validatePassword();
    this.errorMessage.set(errorValidation);
    if(errorValidation != "") {
      return ;
    }
    
    //validate password confirm
    errorValidation = get(this.userToRegister).isMatchPasswords();
    if(errorValidation != "") {
      this.errorMessage.set(errorValidation);
      return
    }
    
    //request
    const registerReqest = this.authService.register(get(this.userToRegister))
    this.requestUser.set(registerReqest)
    registerReqest
      .then(_ => {
        this.setPanel(AuthPanel.LOGIN)
        this.successMessage.set("Check your email for activation");
      }).catch(error => {
        this.errorMessage.set(error.cause);
      })
    ;
  }

  public logout(): void {
    this.authService.cleanSession();
    this.session.set(null)
    push('/auth')
  }

  public getSession():Readable<UserModel> {
    return this.session;
  }
  public getUserToLogin(): Readable<UserModel> {
    return this.userToLogin;
  }
  public getUserToRegister(): Readable<UserModel> {
    return this.userToRegister;
  }
  public getErrorMessage(): Readable<string> {
    return this.errorMessage;
  }
  public getSuccessMessage(): Readable<string> {
    return this.successMessage;
  }
  public getRequestUser():Readable<Promise<UserModel>> {
    return this.requestUser;
  }
}

