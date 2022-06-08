import type BillLine from "src/shopping_car/BillLine";
import OrderModel from "./OrderModel";
import OrdersApiRepository from "./OrdersApiRepository";
import OrdersStore from "./OrderStore";

export default class OrderService {
  private readonly api = new OrdersApiRepository();
  private readonly store = new OrdersStore();

  public async addOrder(bill:BillLine[]):Promise<OrderModel> {
    const order = new OrderModel();
    order.id = 0;
    order.idUser = 1;
    order.products = bill;

    const orderSaved = await this.api.addOrder(order);
    this.store.addOrder(orderSaved)
    return orderSaved;
  }

  public async fetchOrdersInBrowser():Promise<OrderModel[]> {
    const ordersInBrowser = this.store.getOrders();
    if(ordersInBrowser.length <= 0) {
      return []
    }

    const orderFetched = await this.api.getOrders(ordersInBrowser);
    return orderFetched;
  }

  public async deleteById(id: number): Promise<OrderModel> {
    this.store.delete(id);
    const orderDeleted = await this.api.deleteById(id);
    return orderDeleted;
  }

}