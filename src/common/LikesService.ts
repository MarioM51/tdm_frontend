import LikeApiDAO from "./LikeApiDAO";

export enum LikeType {
  BLOG = "liked_blogs",
  PRODUCT = "liked_products",
}

class LikesService {
  private likes:Array<number> = [];
  private likesType:LikeType = null;
  private static api:LikeApiDAO = new LikeApiDAO();

  constructor(typeTy:LikeType) {
    this.likesType = typeTy;
    this.getAllLikes(typeTy);
  }

  private getAllLikes(likesType:LikeType):void {
    const likedSt = window.localStorage.getItem(likesType);
     let likes:Array<number> = null;
     if(likedSt == null) {
       likes =  []
     } else {
       likes = JSON.parse(likedSt) as Array<number>;
     }
     this.likes.push(...likes)
     this.saveChanges()
   }

  public isLiked(id:number):boolean {
    const likeID = this.likes.find(l => l == id);
    const finded = likeID != null;
    return finded;
  }

  public delete(id:number):boolean {
    if(this.isLiked(id)) {
      this.likes = this.likes.filter(l => l != id);
      this.saveChanges()
      LikesService.api.removeLike(this.likesType, id)
      return true;
    }
    return false;
  }

  public add(id:number):boolean {
    if(!this.isLiked(id)) {
      this.likes.push(id)
      this.saveChanges()
      LikesService.api.addLike(this.likesType, id)
      return true;
    }
    return false;
  }

  private saveChanges() {
    window.localStorage.setItem(this.likesType, JSON.stringify(this.likes));
  }

  public static typeStringToEnum(typeSt:string):LikeType {
    switch (typeSt) {
      case "blogs":
        return LikeType.BLOG;
        break;

      case "products":
        return LikeType.PRODUCT;
        break;
    
      default:
        console.error("like type not recognized");
        return null
    }
  }

}

export default class LikesServiceFactory {
  private static instances = new Map<LikeType, LikesService>();

  private constructor() {}

  public static getInstance(typeSt:string):LikesService {
    let likesType = LikesService.typeStringToEnum(typeSt);
    if(likesType == null) {
      return null;
    }

    if(LikesServiceFactory.instances[likesType] == null) {
      return LikesServiceFactory.instances[likesType] = new LikesService(likesType);
    } else {
      return LikesServiceFactory.instances[likesType];
    }
  }
  
}