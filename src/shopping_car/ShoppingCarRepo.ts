import ProductModel from "src/product/01_model/ProductModel";
import BillLine from "./BillLine";

export default class ShoppingCarRepo {

  private static readonly NAME = "SHOPPING_CAR_ITEMS"

  public getAll(): BillLine[] {
    const linesString = window.localStorage.getItem(ShoppingCarRepo.NAME)
    const linesAny = JSON.parse(linesString)
    if(linesAny == null) {
      return [];
    }
    const lines = linesAny.map(l => BillLine.fromRawBillLine(l))
    return lines;
  }

  public save(lines:BillLine[]):void {
    window.localStorage.setItem(ShoppingCarRepo.NAME, JSON.stringify(lines))
  }

  public clean():void {
    window.localStorage.removeItem(ShoppingCarRepo.NAME)
  }

}