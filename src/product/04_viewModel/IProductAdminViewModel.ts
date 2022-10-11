import type { Readable } from "svelte/store"
import type ProductImage from "../01_model/ProductImage"
import type ProductModel from "../01_model/ProductModel"

export default interface IProductViewModel {

  onInit(): void

  onClickAdd(): void
  onSubmitAdd(image: FileList[]): void

  onClickRemove(rowNum: number): void
  onConfirmRemove(): void

  onClickEdit(rowNum: number): void
  onConfirmEdit(image: FileList[]): void

  onDeleteImage(idImage: number): void

  closeProductForm(): void

  //getters/setters
  getProducts(): Readable<ProductModel[]>
  getProductsRequest(): Readable<Promise<ProductModel[]>>

  getProductOnForm(): Readable<ProductModel>
  getProductOnFormRequest(): Readable<Promise<ProductModel>>
  getUploadImageReq(): Readable<Promise<ProductImage[]>>

  getProductToDelete(): Readable<ProductModel>
  getProductToDeleteRequest(): Readable<Promise<ProductModel>>

  getErrorMsg(): Readable<string>
  getErrorFormMsg(): Readable<string>
  getErrorUploadImage(): Readable<string>

  getDeleteImageReq(): Readable<Promise<ProductImage>>

}