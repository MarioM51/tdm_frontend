import type { Readable, Writable } from "svelte/store";
import { writable } from "svelte/store";
import type IAuthViewModel from "../auth/04_viewModel/auth/IAuthViewModel";
import AuthViewModel from "../auth/04_viewModel/auth/AuthViewModel";
import ErrorModel from "../error/ErrorModel";
import OrderService from "./OrdersService";
import OrderModelVM, { ActionType } from "./OrderModelMV";
import type OrderModelMV from "./OrderModelMV";
import AppViewModel from "../AppViewModel";
import OrdersAbstractViewModel from "./OrdersAbstractViewModel";

export default class OrdersAdminViewModel extends OrdersAbstractViewModel {
  private static instance:OrdersAdminViewModel = null;

  //UI Elements
  private readonly errorMessage: Writable<string> = writable(null);
  
  
  private readonly acceptReq: Writable<Promise<any>> = writable(null);
  

  private constructor() {
    super();

  }

  public static getInstance():OrdersAdminViewModel {
    if (this.instance == null) {
      this.instance = new OrdersAdminViewModel();
    }
    return this.instance;
  }

  public findAllOrders():void {
    const reqOrders = this.orderServ.findAll();
    this.allReq.set(reqOrders);
    reqOrders
      .then(fetchedOrders => {
        const ordersCasted = fetchedOrders.map(ori => { return OrderModelVM.cast(ori) });
        this.all.set(ordersCasted)
      })
      .catch((e) => {
        ErrorModel.handleRequestErrors(e, this.errorMessage, this._authMV);
      })
      .finally(() => {
        this.allReq.set(null);
      })
    ;
  }

  public accept(id: number): void {
    const reqAccept:Promise<OrderModelMV> = this.orderServ.accept(id);

    this.setPromiseToOrderInAllOrders(id, ActionType.ACCEPT, reqAccept);

    reqAccept
      .then(orderAccepted => {
        this.all.update(orders => {
          const accepted = orders.find(o => o.id == id)
          accepted.accepted_at = orderAccepted.accepted_at;
          return orders;
        })
      })
      .catch((e) => {
        ErrorModel.handleRequestErrors(e, this.errorMessage, this._authMV)
      })
      .finally(()=> {
        this.setPromiseToOrderInAllOrders(id, ActionType.ACCEPT, null);
      })
    ;
    
  }

  public reject(id: number): void {
    //const reqConfirmOrder = this.orderServ.confirm(id);

    const my = new Promise<any>(function(resolve, reject){
      setTimeout(()=>{ resolve("Todo salio bien"); }, 2000);
      setTimeout(()=>{ reject("Cataplum");}, 2100);
    });

    this.setPromiseToOrderInAllOrders(id, ActionType.DELETE, my);

    my.finally(()=> {
      this.setPromiseToOrderInAllOrders(id, ActionType.DELETE, null);
    })
  }

  //getter/setter
  public getAll():Readable<OrderModelVM[]> {
    return this.all;
  }

  public getAllReq():Readable<Promise<any>> {
    return this.allReq;
  }

  public getAcceptReq():Readable<Promise<any>> {
    return this.acceptReq;
  }

  public getErrorMessage():Readable<string> {
    return this.errorMessage;
  }

}

