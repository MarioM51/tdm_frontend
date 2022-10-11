import UserModel from "../../auth/01_model/UserModel";
import { Readable, writable } from "svelte/store";
import type MyNotification from "../notifications/MyNotification";
import NotifierViewModel from "../notifications/NotifierViewModel";
import Router from "../Router";

interface ISessionService {
  getUserLogged(): Readable<UserModel>;
  logout(): void;
}

export default abstract class ModelView {

  protected readonly _router: Router = new Router();
  protected readonly _notifier = new NotifierViewModel();
  protected readonly _security: ISessionService;

  public handleError(error: any): void {
    console.error(error);

    if (error instanceof Error) {
      this._notifier.showMainMessage(error.message);
    } else {
      this._notifier.showMainMessage("Error inesperado: intente mas tarde");
    }
  }

  public getUserLogged(): Readable<UserModel> {
    return writable(new UserModel());
  }

  public getNotifications(): Readable<MyNotification[]> {
    return this._notifier.getNotifications();
  }

  public showNotification(msg: string, type: string): void {
    this._notifier.addNotification(msg, type)
  }

  public getMainMessage(): Readable<string> {
    return this._notifier.getMainMessage();
  }

  public logout(): void {
    this._security.logout();
  }


}