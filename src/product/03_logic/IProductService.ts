import type ProductModel from "../01_model/ProductModel"

export default interface IProductService {

  findAll():Promise<ProductModel[]>

  add(toAdd:ProductModel):Promise<ProductModel>

}
