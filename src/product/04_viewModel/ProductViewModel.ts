import { get, writable } from "svelte/store";
import type { Writable, Readable } from "svelte/store";
import type IProductViewModel from "./IProductViewModel";
import type IProductService from "../03_logic/IProductService";
import ProductService from "../03_logic/ProductService";
import ProductModel from "../01_model/ProductModel";

export default class ProductViewModel implements IProductViewModel {

  private static _instance:IProductViewModel = null;
  private readonly _productServ:IProductService = new ProductService();

  //Data UI
  private _products:Writable<ProductModel[]> = writable([]);
  private _productsRequest:Writable<Promise<ProductModel[]>> = writable(null);

  private _productToAdd:Writable<ProductModel> = writable(null);
  private _productToAddRequest:Writable<Promise<ProductModel>> = writable(null);

  private _errorMsg:Writable<string> = writable(null);

  private constructor(){}

  public static getInstance():IProductViewModel {
    if(ProductViewModel._instance == null) {
      ProductViewModel._instance = new ProductViewModel();
    }
    return ProductViewModel._instance;
  }
  
  public onInit(): void {
    const allProdRequest = this._productServ.findAll();
    this._productsRequest.set(allProdRequest);
    allProdRequest
      .then(allProductsFinded => this._products.set(allProductsFinded))
      .catch(err => this._errorMsg.set(err.cause))
    ;
  }

  public onClickAdd(open:boolean):void {
    this._productToAdd.set(open ? new ProductModel() : null)
  }
  public onSubmitAdd(): void {
    this._products.update(table => {
      table.push(get(this._productToAdd));
      this._productToAdd.set(null);
      return table
    })
  }

  public getProducts():Readable<ProductModel[]> { return this._products; }
  public getProductsRequest():Readable<Promise<ProductModel[]>> { return this._productsRequest; }
  
  public getProductToAdd():Readable<ProductModel> { return this._productToAdd; }
  public getProductToAddRequest():Readable<Promise<ProductModel>> { return this._productToAddRequest; }

  public getErrorMsg():Readable<string> { return this._errorMsg }

}