import type OrderModel from "./OrderModel";

export default class OrdersStore {
  private static readonly NAME = "ORDERS_IDS";

  public addOrder(order:OrderModel):void {
    const alreadiExist = this.getOrders().includes(order.id)
    if(!alreadiExist) {
      this.save(order.id);
    } else {
      console.error("Order not saved because id to save already exists");
      
    }
  }

  public getOrders(): number[] {
    const ordersStr = window.localStorage.getItem(OrdersStore.NAME);
    
    let ordersFinded:Array<number> = null;
    if(ordersStr == null) {
      ordersFinded =  []
    } else {
      ordersFinded = JSON.parse(ordersStr) as Array<number>;
    }

    return ordersFinded
  }

  private save(id:number):void {
    const ordarsSaved = this.getOrders();
    ordarsSaved.push(id)
    window.localStorage.setItem(OrdersStore.NAME, JSON.stringify(ordarsSaved));
  }

  public delete(idToDel:number): void {
    const ordarsSaved = this.getOrders();
    const ordersFiltered = ordarsSaved.filter(idSaved => idSaved != idToDel);
    window.localStorage.setItem(OrdersStore.NAME, JSON.stringify(ordersFiltered));
  }

  public deleteAll(): void {
    window.localStorage.removeItem(OrdersStore.NAME)
  }

}