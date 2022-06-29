import BillLine from "../shopping_car/BillLine";

export default class OrderModel {

  constructor(
    public id:number = 0,
    public idUser:number = 0,
    public products:BillLine[] = [],
    public created_at:Date = null,
    public confirmed_at:Date = null,
    public accepted_at:Date = null,
  ){}


  public totalSum():number {
    let total = 0;
    this.products.forEach(l => {
      total += l.total;
    });
    return total
  }

  public static fromJson(rawOrder: any): OrderModel {
    const o = new OrderModel();

    o.id = rawOrder.id;
    o.idUser = rawOrder.idUser;
    o.products = BillLine.fromArrayJson(rawOrder.products);
    o.created_at = new Date(rawOrder.created_at);
    
    o.confirmed_at = new Date(rawOrder.confirmed_at);
    if (o.confirmed_at.getFullYear() == 0) {
      o.confirmed_at = null
    }

    o.accepted_at = new Date(rawOrder.accepted_at);
    if (o.accepted_at.getFullYear() == 0) {
      o.accepted_at = null
    }
    
    return o
  }

  public static fromArrayJson(rawOrders: any): OrderModel[] {
    const users = rawOrders.map((rawO: any) => OrderModel.fromJson(rawO) )
    return users
  }

}