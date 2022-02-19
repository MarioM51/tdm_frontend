export default class ProductModel {

  constructor(
    public id:number=null,
    public name:string=null,
    public price:number=null,
    public image:string=null,
    public description:string=null,
  ){}

  public static fromJson(rawProduct: any): ProductModel {
    
    const p = new ProductModel();
    p.id = rawProduct.id;
    p.name = rawProduct.name;
    p.price = rawProduct.price;
    p.image = rawProduct.image;
    p.description = rawProduct.description;

    return p
  }

  public static fromArrayJson(rawProducts: any): ProductModel[] {
    const users = rawProducts.map((rawP: any) => ProductModel.fromJson(rawP) )
    return users
  }
  
}