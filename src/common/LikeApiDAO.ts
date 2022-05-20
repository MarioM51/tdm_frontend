import { BlogRepository } from "../blog/BlogRepository";
import RequestHelper, { HttpMethod } from "../helpers/RequestHelper";
import ProductApiDAO from "../product/02_data/ProductApiDAO";
import { LikeType } from "./LikesService";

export default class LikeApiDAO {

  public addLike(likeT:LikeType, idItem:number):Promise<number> {
    const r = new RequestHelper<number>();
    r.url = this.getURL(likeT, idItem);

    r.method = HttpMethod.POST;
    //r.token = this._userStore.getToken();
    r.cast = this.castLikes;
    
    const likes = r.doRequest();
    return likes;
  }

  public removeLike(likeT:LikeType, idItem:number):Promise<number> {
    const r = new RequestHelper<number>();
    r.url = this.getURL(likeT, idItem);

    r.method = HttpMethod.DELETE;
    //r.token = this._userStore.getToken();
    r.cast = this.castLikes;
    
    const likes = r.doRequest();
    return likes;
  }

  private getURL(likeT:LikeType, idItem:number):string {
    const postfix = "/" + idItem + "/like"

    switch (likeT) {
      case LikeType.PRODUCT:
        return ProductApiDAO._API + postfix;

      case LikeType.BLOG:
        return BlogRepository._API + postfix;
      
      default:
        return null;
    }
  }

  private async castLikes(resp:any):Promise<number> {
    const rawLikes = await resp.json();
    const likes = rawLikes.likes;
    return likes;
  }

} 