export class BlogModel {

  constructor(
    public id:number=null,
    public title:string=null,
    public body:string=null,
    public thumbnail:string=null,
    public autor:string=null,
    public createdAt:Date=null,
    public updateAt:Date=null,
  ){}

  public static fromJson(rawBlog: any): BlogModel {
    
    const b = new BlogModel();
    b.id = rawBlog.id;
    b.title = rawBlog.title;
    b.body = rawBlog.body;
    b.thumbnail = rawBlog.thumbnail;
    b.autor = rawBlog.autor;
    b.createdAt = rawBlog.createdAt;
    b.updateAt = rawBlog.updateAt;

    return b;
  }

  public static fromArrayJson(rawBlogs: any): BlogModel[] {
    const blogs = rawBlogs.map((rawP: any) => BlogModel.fromJson(rawP) )
    return blogs
  }

}

export class AlertMessage {
  constructor(
    public msg:string,
    public type:string
  ){}

}