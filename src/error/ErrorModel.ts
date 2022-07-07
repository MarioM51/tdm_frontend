
import type IAuthViewModel from "../auth/04_viewModel/auth/IAuthViewModel";
import type { Writable } from "svelte/store";

export default class ErrorModel {

  constructor(
    public status:number = null,
    public cause:string = null
  ) {}

  public static handleRequestErrors(err:ErrorModel, errorMsg:Writable<String>, authMV: IAuthViewModel) {
    const genericMsgError = "Error. Try later";
    if(err instanceof ErrorModel) {
      if(err.status == 401) {
        authMV.logout('session_expired');
      } else if(err.status >= 400 && err.status <= 499) {
        errorMsg.set(err.cause)
      } else {
        errorMsg.set(genericMsgError + ": " + err.cause)
      }
    } else {
      console.error("Error no controlado", err);
      errorMsg.set(genericMsgError)
    }
  }
}