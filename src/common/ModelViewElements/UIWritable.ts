import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type ServiceForUI from "./ServiceForUI";
import type Model from "../types/Model";
import ErrorModel from "../../error/ErrorModel";

export default abstract class UIWritable<E extends Model> {
  public readonly requestOne: Writable<Promise<E>> = writable(null);
  public readonly requestMany: Writable<Promise<E[]>> = writable(null);
  public readonly errorMessage: Writable<string> = writable(null);
  protected readonly _service: ServiceForUI<E> = null;

  constructor(service: ServiceForUI<E>) {
    this._service = service;
  }

  protected _middelwareActionAsync(req: Promise<any>) {
    this.errorMessage.set(null);
    req
      .catch(err => {
        const msg = ErrorModel.getMessageError(err);
        this.errorMessage.set(msg);
      })
      .finally(() => {
        this.requestMany.set(null);
        this.requestOne.set(null);
      })
  }

}