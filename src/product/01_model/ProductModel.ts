
import DateUtils from "../../common/utils/DateUtils";
import CommentModel from "../../comments/CommentModel";
import RouteUtiles from "../../common/utils/RouteUtiles";
import ProductImage from "./ProductImage";

export default class ProductModel {

  constructor(
    public id:number=null,
    public name:string=null,
    public price:number=null,
    public images:ProductImage[]=[],
    public imageUrls:string[]=[],
    public description:string=null,
    public likes:number=null,
    public files: FileList=null,
    public comments: CommentModel[]=[],
    public onHomeScreen: Date=null,
  ){}

  public static fromJson(rawProduct: any): ProductModel {
    const p = new ProductModel();
    Object.assign(p, rawProduct);
    if(rawProduct.images != null) {
      p.images = rawProduct.images.map(i => ProductImage.fromJson(i) );
    } else {
      p.images = [];
    }

    p.onHomeScreen = DateUtils.castDateFromServer(rawProduct.onHomeScreen); 
    
    return p
  }


  public static fromArrayJsonLDInDocument(): ProductModel[] {
    const elmJson = ProductModel.textElementInDocumentToJsonById("products_jsonld");
    const arrayJsonld = elmJson.itemListElement;
    const products:ProductModel[] = arrayJsonld.map(ProductModel.fromLDJson);
    return products
  }

  public static fromJsonLDInDocument(): ProductModel {
    const elmJson = ProductModel.textElementInDocumentToJsonById("product_ld_json");
    const products = ProductModel.fromLDJson(elmJson);
    return products;
  }

  private static textElementInDocumentToJsonById(idElement:string):any {
    const elm = document.querySelector("#"+idElement) as any;
    const elmText = elm.innerText;
    const elmJson = JSON.parse(elmText);
    return elmJson;
  }
  

  private static fromLDJson(rawProduct:any): ProductModel {
    const product = new ProductModel();
    product.id = rawProduct.identifier;
    product.name = rawProduct.name;
    product.price = rawProduct.offers.price;
    product.description = rawProduct.description;
    product.likes = rawProduct.likes;
    product.imageUrls = rawProduct.image;
    product.comments = rawProduct.review?.map(r => CommentModel.fromReviewLDJson(r, product.id));

    return product;
  }

  public hasImages():boolean {
    const resp = this.images.length > 0 && this.images[0] != null;
    return resp;
  }

  public getUrl():string {
    return "/products/" + RouteUtiles.toSlug(this.name) + "-" + this.id;
  }
  
}