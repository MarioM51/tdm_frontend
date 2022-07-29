import RouteUtiles from "../common/utils/RouteUtiles";
import DateUtils from "../common/utils/DateUtils";
import { Consts } from "../Constants";
import type CommentModel from "src/comments/CommentModel";

export class BlogModel {

  private static readonly URL_IMG = Consts.HOST + "/api/blogs";

  constructor(
    public id:number=0,
    public title:string=null,
    public body:string=null,
    public abstract:string=null,
    public thumbnail:string=null,
    public imageUrl:string=null,
    public author:string=null,
    public likes:number=0,
    public createdAt:Date=null,
    public updateAt:Date=null,
    public comments:BlogComment[]=[],
    public commentCount:number=0,
    public comments_rating:number=0,
  ){}

  public static fromJson(rawBlog: any): BlogModel {
    
    const b = new BlogModel();
    b.id = rawBlog.id;
    b.title = rawBlog.title;
    b.body = rawBlog.body;
    b.thumbnail = rawBlog.thumbnail;
    b.author = rawBlog.author;
    b.abstract = rawBlog.abstract;
    b.commentCount = rawBlog.commentCount;
    b.comments_rating = rawBlog.comments_rating;
    b.createdAt = DateUtils.castDateFromServer(rawBlog.created_at);
    b.updateAt = DateUtils.castDateFromServer(rawBlog.updated_at);

    return b;
  }

  public static fromArrayJson(rawBlogs: any): BlogModel[] {
    const blogs = rawBlogs.map((rawP: any) => BlogModel.fromJson(rawP) )
    return blogs
  }

  public static fromArrayJsonLDInDocument(): BlogModel[] {
    const elm = document.querySelector("#blogs_jsonld") as any;
    const elmText = (elm).innerText;
    const elmJson = JSON.parse(elmText)
    const arrayJsonld = elmJson.itemListElement;
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
    blog.imageUrl = rawBlog.image;
    blog.likes = rawBlog.likes;
    if(blog.likes == null) {
      blog.likes = 0;
    }
    blog.author = rawBlog.author?.name;
    blog.updateAt = DateUtils.castDateFromServer(rawBlog.dateModified);
    blog.createdAt = DateUtils.castDateFromServer(rawBlog.datePublished);
    blog.comments = rawBlog.comment.map(r => BlogComment.fromJsonLD(blog.id, r));
    blog.commentCount = rawBlog.commentCount;
    blog.comments_rating = rawBlog.comments_rating;
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

export class BlogComment {
  
  constructor(
    public identifier:number=0,
    public idBlog:number=0,
    public idUser:number=0,
    public text:string='',
    public datePublished:Date=null,
    public rating:number=0,
  ){}

  public static fromJsonLD(idBlog:number, jsonld:any):BlogComment {
    const b = new BlogComment();
    Object.assign(b, jsonld);
    b.idBlog = idBlog;
    b.rating = jsonld.reviewRating.ratingValue;
    return b
  }

  public static fromJson(ori: any): BlogComment {
    const resp = new BlogComment();
    resp.datePublished = ori.created_at;
    resp.idBlog = ori.IdBlog;
    resp.idUser = ori.idUser;
    resp.rating = ori.rating;
    resp.text = ori.text;
    resp.identifier = ori.identifier;
    return resp;
  }

  public static fromComment(n: CommentModel): BlogComment {
    const resp = new BlogComment();
    resp.datePublished = n.created_at;
    resp.idBlog = n.idTarget;
    resp.idUser = n.idUser;
    resp.identifier = n.id;
    resp.rating = n.stars;
    resp.text = n.content;
    return resp;
  }

}

export class AlertMessage {
  constructor(
    public msg:string,
    public type:string
  ){}

}