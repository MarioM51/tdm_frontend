import RequestHelper, { HttpMethod } from "../../helpers/RequestHelper";
import ProductModel from "../01_model/ProductModel";
import AuthStoreDAO from "../../auth/02_data/AuthStoreDAO";
import ProductImage from "../01_model/ProductImage";

export default class ProductApiDAO {

  public static readonly _API = "/products";

  private readonly _userStore = new AuthStoreDAO()

  public add(toAdd:ProductModel): Promise<ProductModel> {
    // use addFile to upload files
    toAdd.files = null;

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

  public addFile(idProduct:number, images:FileList):Promise<ProductImage> {
    const r = new RequestHelper<ProductImage>();
    r.url = ProductApiDAO._API + "/" + idProduct + "/images";
    r.method = HttpMethod.POST;
    r.data = images;
    r.token = this._userStore.getToken();

    r.cast = async (resp) => {
      const img = await resp.json()
      return ProductImage.fromJson(img);
    };

    const imageAdded = r.doRequest();

    return imageAdded
  }


}