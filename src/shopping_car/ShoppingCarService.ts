import OrdersViewModel from "../orders/OrdersClientViewModel";
import type BillLine from "./BillLine";
import ShoppingCarRepo from "./ShoppingCarRepo";

export default class ShoppingCarService {

  private storage:ShoppingCarRepo = new ShoppingCarRepo();
  private ordersVM:OrdersViewModel = OrdersViewModel.getInstance();

  constructor(
    public lines:BillLine[]= [],
  ) {
    const inStorage = this.storage.getAll()
    if(inStorage != null) {
      this.lines.push(...inStorage)
    } 
  }

  public addProduct(newLine:BillLine) {
    const index = this.lines.findIndex(l => l.idProduct == newLine.idProduct);
    if (index == -1) {
      this.lines.push(newLine)
    } else {
      this.lines[index].amount += 1
    }
    this.storage.save(this.lines);
  }

  public removeProduct(line:BillLine) {
    const index = this.lines.findIndex(l => l.idProduct == line.idProduct);
    if (this.lines[index].amount <= 1) {
      this.lines = this.lines.filter(l => l.idProduct != line.idProduct)
    } else {
      this.lines[index].amount -= 1;
    }
    
    if(this.lines.length <= 0) {
      this.storage.clean();
    } else {
      this.storage.save(this.lines);
    }
    
  }

  public get total():number {
    let total = 0;
    this.lines.forEach(p => {
      total += p.unitaryPrice * p.amount;
    })

    return total;
  }

  public get amountProducts():number {
    let total = 0;
    this.lines.forEach(p => {
      total += p.amount;
    })

    return total;
  }

  public addBillToOrder():void {
    this.ordersVM.addOrder(this.lines);
    this.lines = [];
    this.storage.clean();
  }

}