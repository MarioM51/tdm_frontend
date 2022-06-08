import type { Readable, Writable } from "svelte/store";
import { writable } from "svelte/store";
import Constants from "../common/Constants";
import BillLine from "./BillLine";
import ShoppingCarService from "./ShoppingCarService";
import { push } from 'svelte-spa-router'

export default class ShoppingCarVM {

  private readonly shCServ: Writable<ShoppingCarService> = writable(new ShoppingCarService());

  constructor() {

  }

  private static instance: ShoppingCarVM = null;

  public static getInstance(): ShoppingCarVM {
    if (this.instance == null) {
      this.instance = new ShoppingCarVM();
    }

    return this.instance;
  }

  public onInit():void {
    window.addEventListener(Constants.EVENT_ADD_TO_CARD, (e: any) => {
      const toAdd = BillLine.fromProduct(e.detail);
      this.addProduct(toAdd)
    });
  }

  public addProduct(line:BillLine) {
    this.shCServ.update((b) => {
      b.addProduct(line)
      return b
    });
  }

  public removeProduct(line:BillLine) {
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
      return b;
    });
  }

  public setBill(lines:BillLine[]):void {
    this.shCServ.update((b) => {
      b.lines = lines;
      return b;
    });
  }

}
