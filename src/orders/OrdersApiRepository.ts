import RequestHelper, { HttpMethod } from "../helpers/RequestHelper";
import type BillLine from "../shopping_car/BillLine";
import OrderModel from "./OrderModel";

export default class OrdersApiRepository {
  private static readonly _API = "/orders";

  public async addOrder(order:OrderModel):Promise<OrderModel> {
    const r = new RequestHelper<OrderModel>();
    r.url = OrdersApiRepository._API;
    r.method = HttpMethod.POST;

    //I don't know why on order.products.idProduct and order.products.unitaryPrice como as string, and it`s need numbers
    for (let i = 0; i < order.products.length; i++) {
      order.products[i].idProduct = parseInt(order.products[i].idProduct+"") ;
      order.products[i].unitaryPrice = parseInt(order.products[i].unitaryPrice+"") ;
    }

    r.data = order;
    r.cast = this.castOrder;
    
    const productAdded = await r.doRequest();

    return productAdded;

  }

  public async getOrders(ids: number[]):Promise<OrderModel[]> {
    const r = new RequestHelper<OrderModel[]>();
    r.url = OrdersApiRepository._API + "/find";
    r.method = HttpMethod.POST;
    r.data = ids;
    r.cast = async (resp:any) => {
      const rawOrder = await resp.json();
      const product = OrderModel.fromArrayJson(rawOrder);
      return product
    }
    
    const productAdded = await r.doRequest();
    return productAdded;

  }

  public async deleteById(id: number): Promise<OrderModel> {
    const r = new RequestHelper<OrderModel>();
    r.url = OrdersApiRepository._API + "/"+id;
    r.method = HttpMethod.DELETE;
    r.cast = this.castOrder;
    const productAdded = await r.doRequest();
    return productAdded;
  }

  private async castOrder(resp:any):Promise<OrderModel> {
    const rawOrder = await resp.json();
    const order = OrderModel.fromJson(rawOrder);
    return order
  }

}