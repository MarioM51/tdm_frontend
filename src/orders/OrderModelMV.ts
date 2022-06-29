import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import OrderModel from "./OrderModel";

export enum ActionType {
  DELETE,
  ACCEPT,
  CONFIRM,
}

export default class OrderModelMV extends OrderModel {
  public readonly deletePromise: Writable<Promise<any>> = writable(null);
  public readonly acceptPromise: Writable<Promise<any>> = writable(null);
  public readonly confirmPromise: Writable<Promise<any>> = writable(null);

  public static cast(origin:OrderModel):OrderModelMV {
    const target = new OrderModelMV();
    Object.assign(target, origin);
    return target;
  }
}