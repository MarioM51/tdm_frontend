import type Product from "../product/01_model/ProductModel";

export default class BillLine {
  constructor(
    public idProduct:number = null,
    public name:string = null,
    public unitaryPrice:number = 0,
    public amount:number = 0,
  ) {}

  public get total():number {
    return this.unitaryPrice * this.amount;
  }

  public static fromProduct(p:Product):BillLine {
    return new BillLine(p.id, p.name, p.price, 1)
  }

  public static fromRawBillLine(raw:any):BillLine {
    return new BillLine(raw.idProduct, raw.name, raw.unitaryPrice, raw.amount);
  }

}
