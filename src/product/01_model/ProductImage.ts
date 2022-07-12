import { Consts } from "../../Constants";

export default class ProductImage {

  public static IMG_URL = Consts.HOST + '/api/products/image';

  constructor(
    public id_image:number=null,
    public fk_product:number=null,
    public name:string=null,
    public type:string=null,
    public updateAt:string=null,
  ){}

  public static fromJson(rawProduct: any): ProductImage {
    if (rawProduct.id_product == 0) {
      return null
    }
    
    const pi = new ProductImage();
    pi.id_image = rawProduct.id_image;
    pi.fk_product = rawProduct.fk_product;
    pi.name = rawProduct.name;
    pi.type = rawProduct.mime_type;
    pi.updateAt = rawProduct.updated_at;

    return pi
  }

  public getUrlImage():string {
    const resp = ProductImage.IMG_URL + '/' + this.id_image + "?updateAt=" + this.updateAt;
    return resp;
  }
  
}