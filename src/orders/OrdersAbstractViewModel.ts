import AppViewModel from "../AppViewModel";
import AuthViewModel from "../auth/04_viewModel/auth/AuthViewModel";
import type IAuthViewModel from "../auth/04_viewModel/auth/IAuthViewModel";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import OrderModelMV, { ActionType } from "./OrderModelMV";
import OrderService from "./OrdersService";


export default abstract class OrdersAbstractViewModel {

  protected readonly _appVM = AppViewModel.getInstance()
  protected readonly orderServ = new OrderService();
  protected readonly _authMV: IAuthViewModel = AuthViewModel.getInstance();

  protected readonly all: Writable<OrderModelMV[]> = writable([]);
  protected readonly allReq: Writable<Promise<any>> = writable(null);
  
  public async delete(idToDel: number):Promise<void> {
    const userMsg = "Are you sure you want to delete the order whit id " + idToDel + "?";
    const confirm = await this._appVM.showModalDelete(userMsg)
    if(confirm) {
      const reqDelOrder = this.orderServ.deleteById(idToDel);
      const actionType = ActionType.DELETE;
      this.setPromiseToOrderInAllOrders(idToDel, actionType, reqDelOrder)
      
      reqDelOrder
        .then((orderDeleted) => {
          this.all.update(orders => {
            const ordersFiltered = orders.filter(o => o.id != orderDeleted.id);
            return ordersFiltered;
          })
        })
        .finally(()=>{
          this.setPromiseToOrderInAllOrders(idToDel, actionType, null);
        })
      ;
      
    } else {
      console.log("Confirmacion rechazada");
    }
  }


  protected setPromiseToOrderInAllOrders(idOrder:number, type:ActionType, promise:Promise<OrderModelMV>) {
    this.all.update(orders => {
      const order = orders.find(o => o.id == idOrder);
      switch (type) {
        case ActionType.ACCEPT:
          order.acceptPromise.set(promise)
        break;

        case ActionType.DELETE:
          order.deletePromise.set(promise)
        break;

        case ActionType.CONFIRM:
          order.confirmPromise.set(promise)
        break;
      
        default:
          console.error("Type not defined");
        break;
      }

      return orders;
    })
  }


}

