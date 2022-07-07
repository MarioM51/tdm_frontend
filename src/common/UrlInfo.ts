import type IAuthViewModel from "../auth/04_viewModel/auth/IAuthViewModel";
import type UserModel from "../auth/01_model/UserModel";

interface Event {
  (): void;
}

export default class UrlInfo {
  constructor(
    public label:string,
    public url:string,
    public onClick:Event = ()=>{},
  ) {
    
  }

  public static getAdminUrls(session:UserModel, authMV: IAuthViewModel):UrlInfo[] {
    const urls:UrlInfo[] = [];
    if (session != null) {
      if (session.hasRols(["admin"])) {
        urls.push(
          new UrlInfo('Users', '#/users'),
          new UrlInfo('Orders', '#/orders'),
        )
      }
  
      if (session.hasRols(["admin", "products"])) {
        urls.push(
          new UrlInfo('Products', '#/products'),
        )
      }
  
      if (session.hasRols(["admin", "blogs"])) {
        urls.push(
          new UrlInfo('Blogs', '#/blogs'),
        )
      }
      urls.push(
        new UrlInfo('Logout', '#/login', ()=>{authMV.logout('')}),
      )
    } else {
      urls.push(
        new UrlInfo('Login', '#/login'),
      )
    }


    return urls;
  }
}