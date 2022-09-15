import { get, writable } from "svelte/store";
import type { Writable, Readable } from "svelte/store";

export enum ConfirmationState {
  HIDE,
  WAITING,
  ACCEPTED,
  REJECTED,
}

export class Confirmation {
  constructor(
    public message: string = null,
    public state: ConfirmationState = ConfirmationState.HIDE,
  ) { }
}

export default class AppViewModel {

  //utils
  private static _instance: AppViewModel = null;

  //Data UI
  //private _productsRequest:Writable<Promise<ProductModel[]>> = writable(null);
  private readonly _deleteConfirmation: Writable<Confirmation> = writable(new Confirmation());

  private constructor() { }

  public static getInstance(): AppViewModel {
    if (AppViewModel._instance == null) {
      AppViewModel._instance = new AppViewModel();
    }
    return AppViewModel._instance;
  }

  public async showModalDelete(msg: string): Promise<boolean> {
    let confirmation = false;
    this._deleteConfirmation.update(s => {
      s.message = msg;
      s.state = ConfirmationState.WAITING;
      return s;
    })

    while (get(this._deleteConfirmation).state == ConfirmationState.WAITING) {
      await this.sleep(100)
    }

    confirmation = get(this._deleteConfirmation).state == ConfirmationState.ACCEPTED;

    this._deleteConfirmation.update(s => {
      s.state = ConfirmationState.HIDE;
      return s;
    })

    return confirmation;
  }

  public confirmModalDelete(confirm: boolean): void {
    let newState = ConfirmationState.HIDE;
    if (confirm) {
      newState = ConfirmationState.ACCEPTED;
    } else {
      newState = ConfirmationState.REJECTED;
    }

    this._deleteConfirmation.update(s => {
      s.state = newState;
      return s;
    })
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }


  public getDeleteConfirmation(): Readable<Confirmation> { return this._deleteConfirmation; }

}