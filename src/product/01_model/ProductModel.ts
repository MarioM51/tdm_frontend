import ProductImage from "./ProductImage";

export default class ProductModel {

  constructor(
    public id:number=null,
    public name:string=null,
    public price:number=null,
    public image:ProductImage=null,
    public description:string=null,
    public likes:number=null,
    public files: FileList=null
  ){}

  public static fromJson(rawProduct: any): ProductModel {
    const p = new ProductModel();
    Object.assign(p, rawProduct);
    p.image = ProductImage.fromJson(rawProduct.image);
    return p
  }

  public static fromArrayJson(rawProducts: any): ProductModel[] {
    const users = rawProducts.map((rawP: any) => ProductModel.fromJson(rawP) )
    return users
  }

  public static fromArrayJsonLDInDocument(): ProductModel[] {
    const elm = JSON.parse((document.querySelector("#products_jsonld") as any).innerText)
    const arrayJsonld = elm.itemListElement;
    const products = arrayJsonld.map((rawProduct: any) => {
      const product = new ProductModel();
      product.id = rawProduct.identifier;
      product.name = rawProduct.name;
      product.price = rawProduct.offers.price;
      product.description = rawProduct.description;
      product.likes = rawProduct.likes;

      const img = new ProductImage();
      img.updateAt = rawProduct.image_updated_at;
      product.image = img;

      return product;
    });
    return products
  }
  
}