import AuthStoreDAO from "../auth/02_data/AuthStoreDAO";
import RequestHelper, { HttpMethod } from "../helpers/RequestHelper";
import { BlogModel } from "./blog_models";

export interface IBlogRepository {

  findAll(): Promise<BlogModel[]>

  findById(id: number): Promise<BlogModel>;

  save(newBlog: BlogModel): Promise<BlogModel>;

  edit(newInfo: BlogModel): Promise<BlogModel>;

  deletePost(toDel: BlogModel): Promise<BlogModel>;
  
}

export class BlogRepository implements IBlogRepository {

  private static readonly _API = "/blogs";
  
  private static _instance:IBlogRepository = null;
  private readonly _userStore = new AuthStoreDAO()

  private constructor() {}

  public static getInstance():IBlogRepository {
    if( BlogRepository._instance == null) {
      BlogRepository._instance = new BlogRepository();
    }
    return BlogRepository._instance;
  }

  public async findAll(): Promise<BlogModel[]> {
    const r = new RequestHelper<BlogModel[]>();
    r.url = BlogRepository._API;
    r.method = HttpMethod.GET;
    r.cast = async (resp) => {
      const rawBlogs = await resp.json();
      const blogs = BlogModel.fromArrayJson(rawBlogs);
      return blogs
    }
    
    const all = r.doRequest()
    return all
  }

  public async findById(id: number): Promise<BlogModel> {
    const r = new RequestHelper<BlogModel>();
    r.url = BlogRepository._API + "/" + id;
    r.method = HttpMethod.GET;
    r.cast = this.castPost;
    
    const finded = r.doRequest()
    return finded
  }

  public async save(newBlog: BlogModel): Promise<BlogModel> {
    const r = new RequestHelper<BlogModel>();
    r.url = BlogRepository._API;
    r.method = HttpMethod.POST;
    r.token = this._userStore.getToken();
    r.data = newBlog;
    r.cast = this.castPost;
    
    const saved = r.doRequest()
    return saved
  }

  public async edit(newInfo: BlogModel): Promise<BlogModel> {
    const r = new RequestHelper<BlogModel>();
    r.url = BlogRepository._API;
    r.method = HttpMethod.PUT;
    r.token = this._userStore.getToken();
    r.data = newInfo;
    r.cast = this.castPost;
    
    const edited = r.doRequest()
    return edited
  }

  public async deletePost(toDel: BlogModel): Promise<BlogModel> {
    const r = new RequestHelper<BlogModel>();
    r.token = this._userStore.getToken();
    r.url = BlogRepository._API + "/" + toDel.id;
    r.method = HttpMethod.DELETE;
    r.cast = this.castPost;
    
    const deleted = r.doRequest()
    return deleted
  }

  private async castPost(resp: Response) {
    const rawBlogs = await resp.json();
    const blog = BlogModel.fromJson(rawBlogs);
    return blog
  }

}