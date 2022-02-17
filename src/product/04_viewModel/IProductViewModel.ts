import type { Readable } from "svelte/store"
import type ProductModel from "../01_model/ProductModel"

export default interface IProductViewModel {

  onInit():void

  onClickAdd(open:boolean):void
  onSubmitAdd():void


  getErrorMsg():Readable<string>

  getProducts():Readable<ProductModel[]>
  getProductsRequest():Readable<Promise<ProductModel[]>>
  
  getProductToAdd():Readable<ProductModel>
  getProductToAddRequest():Readable<Promise<ProductModel>>
}