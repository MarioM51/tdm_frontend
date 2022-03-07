import type ProductImage from "../01_model/ProductImage"
import type ProductModel from "../01_model/ProductModel"

export default interface IProductService {

  findAll():Promise<ProductModel[]>

  add(toAdd:ProductModel):Promise<ProductModel>

  edit(arg0: ProductModel): Promise<ProductModel>
  
  remove(arg0: ProductModel): Promise<ProductModel>

  addFile(idProduct:number, images:FileList): Promise<ProductImage>
  
  updateImage(idProduct:number, images:FileList): Promise<ProductImage>

}
