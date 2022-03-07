export default class ProductImage {

  constructor(
    public idProduct:number=null,
    public name:string=null,
    public type:string=null,
    public updateAt:string=null,
  ){}

  public static fromJson(rawProduct: any): ProductImage {
    if (rawProduct.id_product == 0) {
      return null
    }
    
    const pi = new ProductImage();
    pi.idProduct = rawProduct.id_product;
    pi.name = rawProduct.name;
    pi.type = rawProduct.type;
    pi.updateAt = rawProduct.updateAt;

    return pi
  }
  
}