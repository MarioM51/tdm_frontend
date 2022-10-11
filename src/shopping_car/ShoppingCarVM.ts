import type { Readable, Writable } from "svelte/store";
import { writable } from "svelte/store";
import { Consts } from "../Constants";
import BillLine from "./BillLine";
import ShoppingCarService from "./ShoppingCarService";
import { push } from 'svelte-spa-router'

export default class ShoppingCarVM {

  private readonly shCServ: Writable<ShoppingCarService>;
  private static instance: ShoppingCarVM = null;
  private _isShaking: Writable<boolean> = writable(false);

  constructor() {
    this.shCServ = writable(new ShoppingCarService())
  }

  public static getInstance(): ShoppingCarVM {
    if (this.instance == null) {
      this.instance = new ShoppingCarVM();
    }

    return this.instance;
  }

  public onInit(): void {
    this.lisenForAddProduc();
    this.lisenForBackButtonForRefreshProductsinCar();
  }

  private lisenForAddProduc() {
    window.addEventListener(Consts.EVENT_ADD_TO_CARD, (e: any) => {
      const toAdd = BillLine.fromProduct(e.detail);
      this.addProduct(toAdd)
      this._isShaking.set(true);
      setTimeout(() => {
        this._isShaking.set(false);
      }, 500);
    });
  }

  private lisenForBackButtonForRefreshProductsinCar() {
    window.addEventListener("pageshow", (evt) => {
      if (evt.persisted) {
        this.shCServ.update((b) => {
          b.syncWithStorageLines();
          return b
        });
      }
    }, false
    );
  }

  public addProduct(line: BillLine) {
    this.shCServ.update((b) => {
      b.addProduct(line)
      return b
    });
  }

  public removeProduct(line: BillLine) {
    this.shCServ.update((b) => {
      b.removeProduct(line)
      return b
    });
  }

  public getBill(): Readable<ShoppingCarService> {
    return this.shCServ;
  }

  public addToOrders(): void {
    this.shCServ.update((b) => {
      b.addBillToOrder();
      push("/orders")
      const event = new CustomEvent(Consts.EVENT_GO_TO_TOP);
      document.dispatchEvent(event);
      return b;
    });
  }

  public setBill(lines: BillLine[]): void {
    this.shCServ.update((b) => {
      b.lines = lines;
      return b;
    });
  }

  public clean(): void {
    this.shCServ.update((b) => {
      b.cleanShoppingCar()
      return b;
    });
  }

  public getIsShaking(): Readable<boolean> {
    return this._isShaking;
  }

}
