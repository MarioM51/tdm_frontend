import RouteUtiles from "../common/utils/RouteUtiles";
import DateUtils from "../common/utils/DateUtils";
import { Consts } from "../Constants";

export class BlogModel {

  private static readonly URL_IMG = Consts.HOST + "/api/blogs";

  constructor(
    public id:number=0,
    public title:string=null,
    public body:string=null,
    public abstract:string=null,
    public thumbnail:string=null,
    public author:string=null,
    public likes:number=0,
    public createdAt:Date=null,
    public updateAt:Date=null,
  ){}

  public static fromJson(rawBlog: any): BlogModel {
    
    const b = new BlogModel();
    b.id = rawBlog.id;
    b.title = rawBlog.title;
    b.body = rawBlog.body;
    b.thumbnail = rawBlog.thumbnail;
    b.author = rawBlog.author;
    b.abstract = rawBlog.abstract;
    b.createdAt = DateUtils.castDateFromServer(rawBlog.created_at);
    b.updateAt = DateUtils.castDateFromServer(rawBlog.updated_at);

    return b;
  }

  public static fromArrayJson(rawBlogs: any): BlogModel[] {
    const blogs = rawBlogs.map((rawP: any) => BlogModel.fromJson(rawP) )
    return blogs
  }

  public static fromArrayJsonLDInDocument(): BlogModel[] {
    const elm = JSON.parse((document.querySelector("#blogs_jsonld") as any).innerText)
    const arrayJsonld = elm.itemListElement;
    const blogs = arrayJsonld.map((rawBlog: any) => {
      const b = this.fromAnyJSONLD(rawBlog)
      return b;
    });
    return blogs
  }

  public static fromJsonLDInDocument(): BlogModel {
    const elm = JSON.parse((document.querySelector("#blog_jsonld") as any).innerText)
    const blog = this.fromAnyJSONLD(elm)
    return blog
  }

  private static fromAnyJSONLD(rawBlog:any) : BlogModel {
    const blog = new BlogModel();
    blog.id = rawBlog.identifier;
    blog.title = rawBlog.headline;
    blog.abstract = rawBlog.abstract;
    blog.body = rawBlog.articleBody;
    blog.thumbnail = rawBlog.image;
    blog.likes = rawBlog.likes;
    if(blog.likes == null) {
      blog.likes = 0;
    }
    blog.author = rawBlog.author?.name;
    blog.updateAt = DateUtils.castDateFromServer(rawBlog.dateModified);
    blog.createdAt = DateUtils.castDateFromServer(rawBlog.datePublished);
    return blog;
  }

  public buildImgURL(): string {
    const newUrl: string = BlogModel.URL_IMG + "/" + this.id + "/image?updateAt="+this.updateAt;
    return newUrl;
  }

  public getSlug( ):string {
    const resp = '/blogs/' + RouteUtiles.toSlug(this.title) + '-' + this.id;
    return resp;
  }

}

export class AlertMessage {
  constructor(
    public msg:string,
    public type:string
  ){}

}