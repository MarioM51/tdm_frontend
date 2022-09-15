
import type { Readable, Writable } from "svelte/store";
import Context from "../Context";
import MyNotification from "./MyNotification";

export default class NotifierViewModel {

  private readonly _context = Context.getInstance();

  private static readonly NOTIFICATION_TIME = 3000;

  public showMainMessage(msg: string): void {
    this._context.setMainMessage(msg);
  }

  public getMainMessage(): Writable<string> {
    return this._context.getMainMessage();
  }

  public addNotification(msg: string, type: string): void {
    this._context.getNotifications().update(ns => {
      const noti = new MyNotification(msg, type);
      ns.push(noti);
      return ns;
    });

    setTimeout(() => {
      this._context.getNotifications().update(ns => {
        ns.shift();
        return ns;
      });
    }, NotifierViewModel.NOTIFICATION_TIME);
  }

  public getNotifications(): Readable<Array<MyNotification>> {
    return this._context.getNotifications();
  }

}