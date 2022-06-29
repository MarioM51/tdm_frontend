import ErrorModel from "../error/ErrorModel";
import type BillLine from "../shopping_car/BillLine";
import OrderModel from "./OrderModel";
import OrderModelMV from "./OrderModelMV";
import OrdersApiRepository from "./OrdersApiRepository";
import OrdersStore from "./OrderStore";

export default class OrderService {
  private readonly api = new OrdersApiRepository();
  private readonly store = new OrdersStore();

  public async addOrder(bill:BillLine[]):Promise<OrderModel> {
    const order = new OrderModel();
    order.id = 0;
    order.idUser = 0;
    order.products = bill;

    const orderSaved = await this.api.addOrder(order);
    this.store.addOrder(orderSaved);
    return orderSaved;
  }

  public async fetchOrdersInBrowser():Promise<OrderModelMV[]> {
    const ordersInBrowser = this.store.getOrders();
    if(ordersInBrowser.length <= 0) {
      return []
    }

    const ordersFetched = await this.api.getOrders(ordersInBrowser);
    const ordersCasted = ordersFetched.map(o => OrderModelMV.cast(o));
    return ordersCasted;
  }

  public async deleteById(id: number): Promise<OrderModelMV> {
    this.store.delete(id);
    const orderDeleted = await this.api.deleteById(id);
    const orderDeletedCasted = OrderModelMV.cast(orderDeleted)
    return orderDeletedCasted;
  }

  public async confirm(id: number): Promise<OrderModelMV> {
    try {
      const confirmed:OrderModel = await this.api.confirm(id);
      const confirmedCasted = OrderModelMV.cast(confirmed)
      return confirmedCasted;
    } catch (error) {
      if(error.status == 403) {
        throw new ErrorModel(error.status, 'You need to add <a style="color: lightblue; text-decoration: underline;" href="#/user-info">aditional info</a>')
      }
      throw error;
    }
  }

  public async findAll(): Promise<OrderModel[]> {
    const orderFetched = await this.api.findAll();
    return orderFetched;
  }

  public async accept(id: number): Promise<OrderModelMV> {
    const accepted:OrderModel = await this.api.accept(id);
    const acceptedCasted = OrderModelMV.cast(accepted)
    return acceptedCasted;
  }

  public deleteOrderInBrowserById(id:number):void {
    this.store.delete(id)
  }

  public deleteAllOrdersInBrowser():void {
    this.store.deleteAll();
  }

  public async findOrderOfuserLogged():Promise<OrderModelMV[]> {
    const orders = await this.api.findByUserLogged();
    const ordersCasted = orders.map(o => OrderModelMV.cast(o));
    return ordersCasted;
  }

}