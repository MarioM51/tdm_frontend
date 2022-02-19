import type ProductModel from "../01_model/ProductModel";
import ProductApiDAO from "../02_data/ProductApiDAO";
import type IProductService from "./IProductService";

export default class ProductService implements IProductService {

  private readonly _productsApi = new ProductApiDAO();

  public findAll(): Promise<ProductModel[]> {
    return this._productsApi.findAll();
  }

  public add(toAdd:ProductModel): Promise<ProductModel> {
    return this._productsApi.add(toAdd);
  }

  public edit(p: ProductModel): Promise<ProductModel> {
    return this._productsApi.edit(p);
  }

  public remove(p: ProductModel): Promise<ProductModel> {
    return this._productsApi.remove(p);
  }

}