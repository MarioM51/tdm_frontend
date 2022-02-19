import type { Readable } from "svelte/store"
import type ProductModel from "../01_model/ProductModel"

export default interface IProductViewModel {

  onInit():void

  onClickAdd():void
  onSubmitAdd():void

  onClickRemove(rowNum: number):void
  onConfirmRemove(): void

  onClickEdit(rowNum:number):void
  onConfirmEdit():void

  closeProductForm():void

  //getters/setters
  getErrorMsg():Readable<string>

  getProducts():Readable<ProductModel[]>
  getProductsRequest():Readable<Promise<ProductModel[]>>
  
  getProductOnForm():Readable<ProductModel>
  getProductOnFormRequest():Readable<Promise<ProductModel>>

  getProductToDelete():Readable<ProductModel>
  getProductToDeleteRequest():Readable<Promise<ProductModel>>
}