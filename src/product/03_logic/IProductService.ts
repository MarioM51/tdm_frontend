import type ProductModel from "../01_model/ProductModel"

export default interface IProductService {

  findAll():Promise<ProductModel[]>

  add(toAdd:ProductModel):Promise<ProductModel>

  edit(arg0: ProductModel): Promise<ProductModel>
  
  remove(arg0: ProductModel): Promise<ProductModel>

}
