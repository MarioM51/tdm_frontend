import BillLine from "../shopping_car/BillLine";
import DateUtils from "../common/utils/DateUtils"

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
    o.created_at = DateUtils.castDateFromServer(rawOrder.created_at);
    o.confirmed_at = DateUtils.castDateFromServer(rawOrder.confirmed_at);
    o.accepted_at = DateUtils.castDateFromServer(rawOrder.accepted_at); 
    
    return o
  }

  public static fromArrayJson(rawOrders: any): OrderModel[] {
    const users = rawOrders.map((rawO: any) => OrderModel.fromJson(rawO) )
    return users
  }

  public isResently():boolean {
    return DateUtils.isResently(this.created_at)
  }

}