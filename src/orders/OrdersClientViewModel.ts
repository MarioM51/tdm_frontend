import ErrorModel from "../error/ErrorModel";
import { get, Readable, writable, Writable } from "svelte/store";
import type BillLine from "../shopping_car/BillLine";
import OrderModelMV, { ActionType } from "./OrderModelMV";
import OrdersAbstractViewModel from "./OrdersAbstractViewModel";
import { push } from "svelte-spa-router";
import type ShoppingCarService from "../shopping_car/ShoppingCarService";
import ShoppingCarVM from "src/shopping_car/ShoppingCarVM";

export default class OrdersViewModel extends OrdersAbstractViewModel {
  private static instance:OrdersViewModel = null;

  private readonly shoppingCarVM = null;

  //ui elements
  private readonly errorMessage: Writable<string> = null; 
  private readonly reqAdd: Writable<Promise<any>> = null;

  private constructor() {
    super();
    this.shoppingCarVM = ShoppingCarVM.getInstance()
    this.errorMessage = writable(null);
    this.reqAdd = writable(null);
  }

  public static getInstance():OrdersViewModel {
    if (this.instance == null) {
      this.instance = new OrdersViewModel();
    }
    return this.instance;
  }

  private resetState():void {
    this.errorMessage.set(null);
    this.reqAdd.set(null);
    this.allReq.set(null);
  }

  public onInit():void {
    this.resetState();
    this.findOrdersInBrowser();
    this.findOrderOfuserLogged();
  }

  public addOrder(bill:BillLine[]):void {
    this.errorMessage.set(null);
    const reqOrders = this.orderServ.fetchOrdersInBrowser();
    this.allReq.set(reqOrders);
    reqOrders
      .then(fetchedOrders => {
        const ordersCasted = fetchedOrders.map(o => OrderModelMV.cast(o));
        this.all.set(ordersCasted);

        const req = this.orderServ.addOrder(bill)
        this.reqAdd.set(req);
        req
          .then(orderSaved => {
            this.shoppingCarVM.clean();
            this.all.update(orders => {
              const orderCasted = OrderModelMV.cast(orderSaved);
              orders.unshift(orderCasted)
              return orders
            })
          })
          .catch((e) => {
            ErrorModel.handleRequestErrors(e, this.errorMessage, this._authMV)
          })
          .finally(()=>{
            this.reqAdd.set(null);
          })
        ;

      })
      .catch((e) => {
        ErrorModel.handleRequestErrors(e, this.errorMessage, this._authMV)
      })
      .finally(() => {
        this.allReq.set(null);
      })
    ;
    
  }

  private findOrdersInBrowser():void {
    const ordersReq = this.orderServ.fetchOrdersInBrowser()
    this.allReq.set(ordersReq);
    ordersReq
      .then(ordersFinded => {
        this.all.update(orders => {
          
          get(this.all).forEach(oAll => {
            ordersFinded = ordersFinded.filter(oServ => oAll.id != oServ.id)
          })

          orders.push(...ordersFinded);
          return orders;
        });
      })
      .catch(err => {
        ErrorModel.handleRequestErrors(err, this.errorMessage, this._authMV)
      })
      .finally(() => {
        this.allReq.set(null);
      })
  }

  private findOrderOfuserLogged():void {
    const session = this._authMV.getSession();
    const userLogged = get(session);
    if (userLogged != null) {
      const ordersReq = this.orderServ.findOrderOfuserLogged();
      this.allReq.set(ordersReq);
      ordersReq
        .then(ordersServer => {
          
          ordersServer.forEach(o => {
            this.orderServ.deleteOrderInBrowserById(o.id);
          });

          get(this.all).forEach(oAll => {
            ordersServer = ordersServer.filter(oServ => oAll.id != oServ.id)
          })

          this.all.update(orders => {
            orders.push(...ordersServer);
            return orders;
          });

        })
        .catch((err) => {
          ErrorModel.handleRequestErrors(err, this.errorMessage, this._authMV);
        })
      ;
    }

  }

  public confirm(id: number): void {
    this.errorMessage.set(null);
    const reqConfirmOrder = this.orderServ.confirm(id);
    const actionType = ActionType.CONFIRM;
    this.setPromiseToOrderInAllOrders(id, actionType, reqConfirmOrder);
    
    reqConfirmOrder
      .then((orderConfirmed) => {
        this.all.update(orders => {
          for (let i = 0; i < orders.length; i++) {
            if (orders[i].id == orderConfirmed.id) {
              orders[i].confirmed_at = orderConfirmed.confirmed_at;
              break;
            }
          }
          return orders;
        });
      })
      .catch((err)=>{
        if(err.status == 403 && err.cause.includes("info") ) {
          throw err;
        }
        if(err.status == 401) {
          push('/login?msg=session_required')
          return 
        }
        ErrorModel.handleRequestErrors(err, this.errorMessage, this._authMV)
      })
      .finally(()=>{
        this.setPromiseToOrderInAllOrders(id, actionType, null);
      })
    ; 
  }

  public getOrders():Readable<OrderModelMV[]> {
    return this.all;
  }

  public getReqAdd():Readable<Promise<any>> {
    return this.reqAdd;
  }

  public getReqAll():Readable<Promise<any>> {
    return this.allReq;
  }

  public getErrorMessage():Readable<string> {
    return this.errorMessage;
  }

}

