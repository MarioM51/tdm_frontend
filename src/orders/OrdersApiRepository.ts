import AuthStoreDAO from "../auth/02_data/AuthStoreDAO";
import RequestHelper, { HttpMethod } from "../helpers/RequestHelper";
import type BillLine from "../shopping_car/BillLine";
import OrderModel from "./OrderModel";

export default class OrdersApiRepository {
  private static readonly _API = "/orders";
  private static readonly _authStore = new AuthStoreDAO();

  public async addOrder(order:OrderModel):Promise<OrderModel> {
    const r = new RequestHelper<OrderModel>();
    r.url = OrdersApiRepository._API;
    r.method = HttpMethod.POST;

    //I don't know why on order.products.idProduct and order.products.unitaryPrice came as string, and it`s need numbers
    for (let i = 0; i < order.products.length; i++) {
      order.products[i].idProduct = parseInt(order.products[i].idProduct+"") ;
      order.products[i].unitaryPrice = parseInt(order.products[i].unitaryPrice+"") ;
    }

    r.data = order;
    r.cast = this.castOrder;

    r.token = OrdersApiRepository._authStore.getToken();
    
    const added = await r.doRequest();
    return added;
  }

  public async getOrders(ids: number[]):Promise<OrderModel[]> {
    const r = new RequestHelper<OrderModel[]>();
    r.url = OrdersApiRepository._API + "/find";
    r.method = HttpMethod.POST;
    r.data = ids;
    r.cast = this.castOrders;
    
    const added = await r.doRequest();
    return added;
  }

  public async deleteById(id: number): Promise<OrderModel> {
    const r = new RequestHelper<OrderModel>();
    r.url = OrdersApiRepository._API + "/"+id;
    r.method = HttpMethod.DELETE;
    r.cast = this.castOrder;
    
    const deleted = await r.doRequest();
    return deleted;
  }

  public async confirm(id: number): Promise<OrderModel> {
    const r = new RequestHelper<OrderModel>();
    r.url = OrdersApiRepository._API + "/"+id+"/confirm";
    r.method = HttpMethod.PUT;
    r.token = OrdersApiRepository._authStore.getToken();
    r.cast = this.castOrder;

    const myPromise = new Promise(function(resolve, _){ setTimeout(function(){ resolve("Success!"); }, 2000); });
    await myPromise;
    const confirmed = await r.doRequest();
    return confirmed;
  }

  public async findAll(): Promise<OrderModel[]> {
    const r = new RequestHelper<OrderModel[]>();
    r.url = OrdersApiRepository._API;
    r.method = HttpMethod.GET;
    r.token = OrdersApiRepository._authStore.getToken();
    r.cast = this.castOrders;
    
    const all = await r.doRequest();
    return all;
  }

  public async accept(id: number): Promise<OrderModel> {
    const r = new RequestHelper<OrderModel>();
    r.url = OrdersApiRepository._API + "/" + id + "/accept";
    r.method = HttpMethod.PUT;
    r.token = OrdersApiRepository._authStore.getToken();
    r.cast = this.castOrder;
    
    const all = await r.doRequest();
    return all;
  }

  public async findByUserLogged(): Promise<OrderModel[]> {
    const r = new RequestHelper<OrderModel[]>();
    r.url = OrdersApiRepository._API + "/findByUserLogged";
    r.method = HttpMethod.GET;
    r.token = OrdersApiRepository._authStore.getToken();
    r.cast = this.castOrders;

    const all = await r.doRequest();
    return all;
  }

  private async castOrder(resp:any):Promise<OrderModel> {
    const rawOrder = await resp.json();
    const order = OrderModel.fromJson(rawOrder);
    return order
  }

  private async castOrders(resp:any):Promise<OrderModel[]> {
    const rawOrders = await resp.json();
    const orders = OrderModel.fromArrayJson(rawOrders);
    return orders;
  }

}