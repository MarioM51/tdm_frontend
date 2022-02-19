import RequestHelper, { HttpMethod } from "../../helpers/RequestHelper";
import ProductModel from "../01_model/ProductModel";
import AuthStoreDAO from "../../auth/02_data/AuthStoreDAO";

export default class ProductApiDAO {

  private static readonly _API = "/products";

  private readonly _userStore = new AuthStoreDAO()

  public add(toAdd:ProductModel): Promise<ProductModel> {
    const r = new RequestHelper<ProductModel>();
    r.url = ProductApiDAO._API;
    r.method = HttpMethod.POST;
    r.token = this._userStore.getToken();
    r.data = toAdd;
    r.cast = this.castProduct;
    
    const productAdded = r.doRequest();

    return productAdded;
  }

  public findAll() : Promise<ProductModel[]> {
    const r = new RequestHelper<ProductModel[]>();
    r.url = ProductApiDAO._API;
    r.method = HttpMethod.GET;
    r.cast = async (resp) => {
      const rawProducts = await resp.json();
      const products = ProductModel.fromArrayJson(rawProducts);
      return products
    }

    const products = r.doRequest();

    return products;
  }

  public remove(p: ProductModel): Promise<ProductModel> {
    const r = new RequestHelper<ProductModel>();
    r.url = ProductApiDAO._API + "/" + p.id;
    r.method = HttpMethod.DELETE;
    r.token = this._userStore.getToken();
    r.cast = this.castProduct;

    const productDeleted = r.doRequest();

    return productDeleted;
    
  }

  public edit(newInfo: ProductModel): Promise<ProductModel> {
    const r = new RequestHelper<ProductModel>();
    r.url = ProductApiDAO._API;
    r.method = HttpMethod.PUT;
    r.token = this._userStore.getToken();
    r.data = newInfo;
    r.cast = this.castProduct;
    
    const productAdded = r.doRequest();

    return productAdded;
  }

  private async castProduct(resp:Response): Promise<ProductModel> {
    const rawProducts = await resp.json();
    const product = ProductModel.fromJson(rawProducts);
    return product
  }


}