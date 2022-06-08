import type Product from "../product/01_model/ProductModel";

export default class BillLine {
  constructor(
    public idProduct:number = 0,
    public name:string = null,
    public unitaryPrice:number = 0,
    public amount:number = 0,
    public idOrder:number = 0,
  ) {}

  public get total():number {
    return this.unitaryPrice * this.amount;
  }

  public static fromJson(raw:any):BillLine {
    const bl = new BillLine();
    
    bl.idOrder = raw.idOrder;
    bl.idProduct = raw.idProduct;
    bl.amount = raw.amount;
    bl.name = raw.name;
    bl.unitaryPrice = raw.unitaryPrice;

    return bl;
  }

  public static fromArrayJson(raw:any):BillLine[] {
    const users = raw.map((rawP: any) => BillLine.fromJson(rawP) )
    return users
  }

  public static fromProduct(p:Product):BillLine {
    return new BillLine(p.id, p.name, p.price, 1)
  }

  public static fromRawBillLine(raw:any):BillLine {
    return new BillLine(raw.idProduct, raw.name, raw.unitaryPrice, raw.amount);
  }

}
