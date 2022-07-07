import type ProductImage from "../01_model/ProductImage";
import type ProductModel from "../01_model/ProductModel";
import ProductApiDAO from "../02_data/ProductApiDAO";
import type IProductService from "./IProductService";

export default class ProductService implements IProductService {

  private readonly _productsApi = new ProductApiDAO();

  public async findAll(): Promise<ProductModel[]> {
    const all = await this._productsApi.findAll()
    return all;
  }

  public add(toAdd:ProductModel): Promise<ProductModel> {
    toAdd.files = null;
    return this._productsApi.add(toAdd);
  }

  public edit(p: ProductModel): Promise<ProductModel> {
    return this._productsApi.edit(p);
  }

  public remove(p: ProductModel): Promise<ProductModel> {
    return this._productsApi.remove(p);
  }

  public addFile(idProduct:number, images:FileList): Promise<ProductImage> {
    return this._productsApi.addFile(idProduct, images);
  }

}