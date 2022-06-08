import { Readable, writable, Writable } from "svelte/store";
import type BillLine from "../shopping_car/BillLine";
import type OrderModel from "./OrderModel";
import OrderService from "./OrdersService";

export default class OrdersViewModel {
  private readonly orders: Writable<OrderModel[]> = writable([]);
  private static instance:OrdersViewModel = null;
  private readonly reqAdd: Writable<Promise<any>> = writable(null);
  private readonly reqAll: Writable<Promise<any>> = writable(null);
  private readonly reqDel: Writable<Promise<any>> = writable(null);

  private readonly orderServ = new OrderService();

  private constructor() {

  }

  public static getInstance():OrdersViewModel {
    if (this.instance == null) {
      this.instance = new OrdersViewModel();
    }
    return this.instance;
  }

  public addOrder(bill:BillLine[]):void {

    const reqOrders = this.orderServ.fetchOrdersInBrowser();
    this.reqAll.set(reqOrders);
    reqOrders
      .then(fetchedOrders => {
        this.orders.set(fetchedOrders);

        const req = this.orderServ.addOrder(bill)
        this.reqAdd.set(req);
        req
          .then(orderSaved => {
            this.orders.update(orders => {
              orders.unshift(orderSaved)
              return orders
            })
          })
          .catch((e) => {
            console.error("Error adding order", e);
          })
          .finally(()=>{
            this.reqAdd.set(null);
          })
        ;

      })
      .catch((e) => {
        console.error("Error fetchOrders", e);
      })
      .finally(() => {
        this.reqAll.set(null);
      })
    ;
    
  }

  public fetchOrders():void {
    const reqOrders = this.orderServ.fetchOrdersInBrowser();
    this.reqAll.set(reqOrders);
    reqOrders
      .then(fetchedOrders => {
        this.orders.set(fetchedOrders)
      })
      .catch((e) => {
        console.error("Error fetchOrders", e);
      })
      .finally(() => {
        this.reqAll.set(null);
      })
    ;
  }

  public delete(idToDel: number):void {
    const reqDelOrder = this.orderServ.deleteById(idToDel);
    this.reqDel.set(reqDelOrder);
    reqDelOrder
      .then((orderDeleted) => {
        this.orders.update(os => {
          const ordersFiltered = os.filter(o => o.id != orderDeleted.id);
          return ordersFiltered;
        })
      })
      .finally(()=>{
        setTimeout(() => {
          this.reqDel.set(null);
        }, 10000);
      })
    ;
  }

  public getOrders():Readable<OrderModel[]> {
    return this.orders;
  }

  public getReqAdd():Readable<Promise<any>> {
    return this.reqAdd;
  }

  public getReqAll():Readable<Promise<any>> {
    return this.reqAll;
  }
  public getReqDel():Readable<Promise<any>> {
    return this.reqDel;
  }
  

}

